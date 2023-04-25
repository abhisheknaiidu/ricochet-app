import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import usePagination from '@richochet/hooks/usePagination';
import { combineClasses, formatCurrency } from '@richochet/utils/helperFunctions';
import { Coin } from 'constants/coins';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { TokenData } from '../balances';
import { CoinChange, DataType } from '../coins/coin-change';
import { MarketData } from '../markets';
import { PositionData } from '../positions';
import { TableLoader } from './table-loader';
import { MarketRow } from './market-row';

interface Props {
	headers: string[];
	rowData: PositionData[] | MarketData[] | TokenData[];
	selectable?: boolean;
	tableLoaderRows: number;
	selectData?: Function;
}

const isPositionData = (data: PositionData | MarketData | TokenData): data is PositionData =>
	!!(data as PositionData).positions || (data as PositionData).positions === 0;
const isMarketData = (data: PositionData | MarketData | TokenData): data is MarketData =>
	!!(data as MarketData).streams || (data as MarketData).streams === 0;
const isTokenData = (data: PositionData | MarketData | TokenData): data is TokenData => !!(data as TokenData).token;

export const DataTable: NextPage<Props> = ({
	headers,
	rowData,
	selectable,
	selectData,
	tableLoaderRows,
}): JSX.Element => {
	const { t } = useTranslation('home');
	const { firstContentIndex, lastContentIndex, nextPage, prevPage, page, gaps, setPage, totalPages } = usePagination({
		contentPerPage: 6,
		count: rowData.length,
	});
	return (
		<>
			<div className='overflow-auto'>
				{rowData.length === 0 && <TableLoader headers={headers} rowNumber={tableLoaderRows} />}
				{rowData.length > 0 && (
					<table className='table-fixed min-w-full'>
						<thead>
							<tr>
								{headers.map((title, index) => (
									<th scope='col' key={index} className='font-normal text-slate-400 px-6 py-4 text-start'>
										{t(`${title.toLocaleLowerCase().replace(/\s/g, '-')}`)}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{rowData.slice(firstContentIndex, lastContentIndex).map((data, index) => (
								<tr
									key={index}
									className={combineClasses(
										selectable ? 'cursor-pointer' : 'cursor-auto',
										'text-slate-200 border-b border-slate-600'
									)}
									onClick={() => (selectable && isPositionData(data) ? selectData?.(data) : null)}>
									{isPositionData(data) ? (
										<>
											<td className='px-2 py-4 whitespace-nowrap'>
												<div className='inline-flex items-center gap-2'>
													<CoinChange coinA={data.coinA} coinB={data.coinB} type={DataType.Position} />
												</div>
											</td>
											{/* <td className='px-6 py-4 whitespace-nowrap'>{data.positions}</td> */}
{/* 											<td className='px-6 py-4 whitespace-nowrap'>
												{data.avgBuyPrice} {data.coinA}
											</td> */}
											<td className='px-6 py-4 whitespace-nowrap'>
												<p>{formatCurrency(parseFloat(data.rateUsdValue))}</p>
												<p className='text-slate-400'>
													{parseFloat(data.output).toFixed(3)} <span className='text-sm'>{data.coinA}x</span>
												</p>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<p>{formatCurrency(parseFloat(data.input.toFixed(3)))}</p>
												<p className='text-slate-400'>
													{data.input.toFixed(3)} <span className='text-sm'>{data.coinA}x</span>
												</p>
											</td>
										</>
									) : isMarketData(data) ? (
										//@ts-ignore
										<MarketRow data={data}/>
									) : isTokenData(data) ? (
										<>
											<td className='flex items-center px-2 py-4 whitespace-nowrap space-x-2'>
												<CoinChange token={data.token} type={DataType.Balances} />
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<p>
													{data.token === Coin.WBTC ||
													data.token === Coin.IbAlluoBTC ||
													data.token === Coin.StIbAlluoBTC ||
													data.token === Coin.ETH ||
													data.token === Coin.IbAlluoETH ||
													data.token === Coin.StIbAlluoETH
														? parseFloat(data.ricAmount)
																.toFixed(20)
																.match(/^-?\d*\.?0*\d{0,2}/)?.[0]
																.replace(/(?:\.0+|(\.\d+?)0+)$/, '$1')
														: parseFloat(data.ricAmount).toFixed(2)}
												</p>
												<p className='text-slate-400'>{formatCurrency(parseFloat(data.ricUsdAmount))}</p>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<p>
													{data.walletAmount === 'N/A'
														? data.walletAmount
														: data.token === Coin.WBTC ||
														  data.token === Coin.IbAlluoBTC ||
														  data.token === Coin.StIbAlluoBTC ||
														  data.token === Coin.ETH ||
														  data.token === Coin.IbAlluoETH ||
														  data.token === Coin.StIbAlluoETH
														? parseFloat(data.walletAmount)
																.toFixed(20)
																.match(/^-?\d*\.?0*\d{0,2}/)?.[0]
																.replace(/(?:\.0+|(\.\d+?)0+)$/, '$1')
														: parseFloat(data.walletAmount).toFixed(2)}
												</p>
												<p className='text-slate-400'>
													{data.walletUsdAmount === 'N/A'
														? data.walletUsdAmount
														: formatCurrency(parseFloat(data.walletUsdAmount))}
												</p>
											</td>
											{/* <td className='px-6 py-4 whitespace-nowrap'>{formatCurrency(data.dollarVal)}</td> */}
										</>
									) : (
										<></>
									)}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
			{rowData.length > 0 && (
				<div className='flex justify-end text-slate-500 space-x-2 mt-4'>
					<button
						onClick={prevPage}
						className={`${page !== 1 && 'hover:text-slate-300'} ${page === 1 && 'text-slate-600'}`}
						disabled={page === 1}>
						<ChevronLeftIcon className='h-4 w-4' />
					</button>
					<button onClick={() => setPage(1)} className={`${page === 1 && 'text-slate-100'}`}>
						1
					</button>
					{gaps.before ? '...' : ''}
					{gaps.paginationGroup.map((num: number) => (
						<button onClick={() => setPage(num)} key={num} className={`${page === num ? 'text-slate-100' : ''}`}>
							{num}
						</button>
					))}
					{gaps.after ? '...' : ''}
					{totalPages > 1 && (
						<button onClick={() => setPage(totalPages)} className={`${page === totalPages && 'text-slate-100'}`}>
							{totalPages}
						</button>
					)}
					<button
						onClick={nextPage}
						className={`${page !== totalPages && 'hover:text-slate-300'} ${page === totalPages && 'text-slate-600'}`}
						disabled={page === totalPages}>
						<ChevronRightIcon className='h-4 w-4' />
					</button>
				</div>
			)}
		</>
	);
};
