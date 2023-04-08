import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { combineClasses } from '@richochet/utils/helperFunctions';
import { Coin, iconsCoin } from 'constants/coins';
import { NextPage } from 'next';
import Image from 'next/image';

export enum DataType {
	Position = 'Position',
	Market = 'Market',
	Balances = 'Balances',
	ViewPosition = 'View Position',
}

interface Props {
	coinA?: string;
	coinB?: string;
	token?: string;
	type: DataType;
}

export const CoinChange: NextPage<Props> = ({ coinA, coinB, token, type }): JSX.Element => {
	// if (type === DataType.Position && coinA && coinB) {
	// 	return (
	// 		<>
	// 			<Image width='24' height='24' src={iconsCoin[coinA as Coin]!} alt={coinA} />
	// 			<ArrowLongRightIcon className='h-5 w-5' />
	// 			<Image width='24' height='24' src={iconsCoin[coinB as Coin]!} alt={coinB} />
	// 		</>
	// 	);
	// }
	if ((type === DataType.Market || type === DataType.Position) && coinA && coinB) {
		return (
			<div className='flex flex-wrap items-center justify-between lg:space-x-2'>
				<span className='flex items-center space-x-2'>
					<Image width='24' height='24' src={iconsCoin[coinA as Coin]!} alt={coinA} />{' '}
					<span className='text-sm'>{coinA}</span>
				</span>
				<ArrowLongRightIcon className='h-5 w-5' />
				<span className='flex items-center space-x-2'>
					<Image width='24' height='24' src={iconsCoin[coinB as Coin]!} alt={coinB} />{' '}
					<span className='text-sm'>{coinB}</span>
				</span>
			</div>
		);
	}
	if (type === DataType.Balances && token) {
		return (
			<>
				<Image width='24' height='24' src={iconsCoin[token as Coin]!} alt={token} />
				{/*refactor this garbage*/}
				<span
					className={combineClasses(
						token === Coin.ETH
							? 'bg-eth text-slate-800 px-1 py-0'
							: token === Coin.WBTC
							? 'bg-btc text-slate-800 px-1 py-0'
							: token === Coin.RIC
							? 'bg-ric text-slate-200 px-1 py-0'
							: token === Coin.USDC
							? 'bg-usdc text-slate-200 px-1 py-0'
							: token === Coin.StIbAlluoETH
							? 'bg-stIbAlluoEth text-slate-800 px-1 py-0'
							: token === Coin.StIbAlluoUSD
							? 'bg-stIbAlluoUsd text-slate-800 px-1 py-0'
							: 'bg-transparent',
						'text-sm'
					)}>
					{token}
				</span>
			</>
		);
	}
	if (type === DataType.ViewPosition && coinA && coinB) {
		return (
			<>
				<span className='flex items-center space-x-2'>
					<Image width='40' height='40' src={iconsCoin[coinA as Coin]!} alt={coinA} />{' '}
					<span className='font-medium text-slate-100'>{coinA}</span>
				</span>
				<ArrowLongRightIcon className='h-10 w-16' />
				<span className='flex items-center space-x-2'>
					<Image width='30' height='30' src={iconsCoin[coinB as Coin]!} alt={coinB} />{' '}
					<span className='font-medium text-slate-100'>{coinB}</span>
				</span>
			</>
		);
	}
	return <></>;
};
