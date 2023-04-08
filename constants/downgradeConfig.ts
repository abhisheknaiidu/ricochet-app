import { Coin } from './coins';
import {
	USDCxAddress,
	WETHxAddress,
	DAIxAddress,
	WBTCxAddress,
	MATICxAddress,
	StIbAlluoETHAddress,
	StIbAlluoUSDAddress,
	StIbAlluoBTCAddress,
} from './polygon_config';

import {
	fUSDCx,
	fDAIx,
} from './mumbai_config';
import { optimismDAIx, optimismUSDCx, OPx } from './optimism_config';

export const downgradeTokensList = [
	{
		coin: Coin.USDCx,
		tokenAddress: USDCxAddress,
	},
	{
		coin: Coin.DAIx,
		tokenAddress: DAIxAddress,
	},
	{
		coin: Coin.WETHx,
		tokenAddress: WETHxAddress,
	},
	{
		coin: Coin.WBTCx,
		tokenAddress: WBTCxAddress,
	},
	{
		coin: Coin.MATICx,
		tokenAddress: MATICxAddress,
	},
	{
		coin: Coin.StIbAlluoETH,
		tokenAddress: StIbAlluoETHAddress,
	},
	{
		coin: Coin.StIbAlluoUSD,
		tokenAddress: StIbAlluoUSDAddress,
	},
	{
		coin: Coin.StIbAlluoBTC,
		tokenAddress: StIbAlluoBTCAddress,
	},
];

export const mumbaiDowngradeList = [
	{
		coin: Coin.FDAIx,
		tokenAddress: fDAIx,
	},
	{
		coin: Coin.FUSDCx,
		tokenAddress: fUSDCx,
	},
]

export const optimismDowngradeList = [
	{
		coin: Coin.OPUSDCx,
		tokenAddress: optimismUSDCx,
	},
	{
		coin: Coin.OPDAIx,
		tokenAddress: optimismDAIx,
	},
	{
		coin: Coin.OPx,
		tokenAddress: OPx,
	}
]