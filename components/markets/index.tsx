import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { getFlowUSDValue } from '@richochet/utils/getFlowUsdValue';
import { InvestmentFlow } from 'constants/flowConfig';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useNetwork } from 'wagmi';
import { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../cards/card-title';
import { DataTable } from '../table/data-table';

export interface MarketData extends InvestmentFlow {
	total: number;
	usdValue: string;
	feePercent: string;
	streams: number;
}
interface Props {
	coingeckoPrices: Map<string, number>;
	sortedList: InvestmentFlow[];
	queries: Map<
		string,
		{
			flowKey: string;
			flowsReceived: number;
			flowsOwned: string;
			totalFlows: number;
			placeholder: string;
			subsidyRate: { perso: number; total: number; endDate: string };
			streamedSoFar?: number;
			receivedSoFar?: number;
		}
	>;
}

const marketTitles = ['market', 'fee percent', 'total value streaming', 'currently streaming'];

export const Markets: NextPage<Props> = ({ coingeckoPrices, sortedList, queries }) => {
	const { t } = useTranslation('home');
	const [search, setSearch] = useState('');
	const [marketList, setMarketList] = useState<MarketData[]>([]);
	const [filteredList, setFilteredList] = useState<MarketData[]>([]);
	const { chain } = useNetwork();

	useEffect(() => {
		if (sortedList.length > 0 && queries.size > 0) {
			const marketData: MarketData[] = [];
			sortedList.map((item) =>
				marketData.push({
					...item,
					total: parseFloat(queries.get(item.flowKey)?.flowsOwned!) || 0,
					usdValue: getFlowUSDValue(item, queries, coingeckoPrices),
					feePercent: item.coinA.includes('IbAlluo') ? '0.5%' : '2%',
					streams: queries.get(item.flowKey)?.totalFlows || 0,
				})
			);
			const sortedData = marketData.sort((a, b) => b.total - a.total);
			setMarketList(sortedData);
		}
	}, [queries, coingeckoPrices, sortedList]);

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setSearch(value);
		const filtered = marketList.filter(
			(el) =>
				el.coinA.toUpperCase().includes(value.toUpperCase()) || el.coinB.toUpperCase().includes(value.toUpperCase())
		);
	};

	return (
		<>
			<CardTitle
				content={
					<div className='w-full flex flex-wrap items-center justify-between space-y-4 lg:space-y-0'>
						<p className='text-slate-400 uppercase'>{t('markets')}</p>
						<label className='relative block w-max'>
							<span className='sr-only'>Search</span>
							<span className='absolute inset-y-0 right-0 flex items-center pr-2'>
								<MagnifyingGlassIcon className='h-4 w-4 fill-slate-400' viewBox='0 0 20 20' />
							</span>
							<input
								className='input-search'
								placeholder={t('search')!}
								type='text'
								name='search'
								value={search}
								onChange={handleSearch}
							/>
						</label>
					</div>
				}
			/>
			{
				chain && <DataTable headers={marketTitles} rowData={search ? filteredList : marketList} tableLoaderRows={12} />
			}
		</>
	);
};
