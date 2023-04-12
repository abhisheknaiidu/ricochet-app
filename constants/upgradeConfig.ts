import { Coin } from './coins';
import {
	DAIAddress,
	DAIxAddress,
	USDCAddress,
	USDCxAddress,
	WETHAddress,
	WETHxAddress,
	WBTCAddress,
	WBTCxAddress,
	WMATICAddress,
	MATICxAddress,
	RICAddress,
	StIbAlluoETHAddress,
	IbAlluoETHAddress,
	StIbAlluoBTCAddress,
	IbAlluoBTCAddress,
	StIbAlluoUSDAddress,
	IbAlluoUSDAddress,
	ZeroAddress,
} from './polygon_config';

import { fUSDC, fDAI, fUSDCx, fDAIx } from './mumbai_config';

import {
	optimismUSDC,
	optimismUSDCx,
	optimismDAI,
	optimismDAIx,
	OPToken,
	OPx,
	optimismETHx,
	optimismETH,
} from './optimism_config';

export const upgradeTokensList: {
	coin: Coin;
	tokenAddress: string;
	superTokenAddress: string;
	multi: number;
	key:
		| 'hasIbAlluoUSDApprove'
		| 'hasIbAlluoETHApprove'
		| 'hasIbAlluoBTCApprove'
		| 'hasWethApprove'
		| 'hasUsdcApprove'
		| 'hasWbtcApprove'
		| 'hasDaiApprove'
		| 'hasMaticApprove';
}[] = [
	{
		coin: Coin.RIC,
		tokenAddress: ZeroAddress,
		superTokenAddress: RICAddress,
		multi: 1e6,
		key: 'hasUsdcApprove',
	},
	{
		coin: Coin.StIbAlluoUSD,
		tokenAddress: IbAlluoUSDAddress,
		superTokenAddress: StIbAlluoUSDAddress,
		multi: 1e18,
		key: 'hasIbAlluoUSDApprove',
	},
	{
		coin: Coin.StIbAlluoETH,
		tokenAddress: IbAlluoETHAddress,
		superTokenAddress: StIbAlluoETHAddress,
		multi: 1e18,
		key: 'hasIbAlluoETHApprove',
	},
	{
		coin: Coin.StIbAlluoBTC,
		tokenAddress: IbAlluoBTCAddress,
		superTokenAddress: StIbAlluoBTCAddress,
		multi: 1e18,
		key: 'hasIbAlluoBTCApprove',
	},
	{
		coin: Coin.USDC,
		tokenAddress: USDCAddress,
		superTokenAddress: USDCxAddress,
		multi: 1e6,
		key: 'hasUsdcApprove',
	},
	{
		coin: Coin.DAI,
		tokenAddress: DAIAddress,
		superTokenAddress: DAIxAddress,
		multi: 1e18,
		key: 'hasDaiApprove',
	},
	{
		coin: Coin.WETH,
		tokenAddress: WETHAddress,
		superTokenAddress: WETHxAddress,
		multi: 1e18,
		key: 'hasWethApprove',
	},
	{
		coin: Coin.WBTC,
		tokenAddress: WBTCAddress,
		superTokenAddress: WBTCxAddress,
		multi: 1e8,
		key: 'hasWbtcApprove',
	},
	{
		coin: Coin.MATIC,
		tokenAddress: WMATICAddress,
		superTokenAddress: MATICxAddress,
		multi: 1e18,
		key: 'hasMaticApprove',
	},
];

export const mumbaiUpgradeTokensList: {
	coin: Coin;
	tokenAddress: string;
	superTokenAddress: string;
	multi: number;
	key: 'hasFUsdcApprove' | 'hasFDaiApprove';
}[] = [
	{
		coin: Coin.FUSDC,
		tokenAddress: fUSDC,
		superTokenAddress: fUSDCx,
		multi: 1e6,
		key: 'hasFUsdcApprove',
	},
	{
		coin: Coin.FDAI,
		tokenAddress: fDAI,
		superTokenAddress: fDAIx,
		multi: 1e18,
		key: 'hasFDaiApprove',
	},
];

export const optimismUpgradeTokensList: {
	coin: Coin;
	tokenAddress: string;
	superTokenAddress: string;
	multi: number;
	key: 'hasOpUsdcApprove' | 'hasOpDaiApprove' | 'hasOpEthApprove' | 'hasOPApprove';
}[] = [
	{
		coin: Coin.OPUSDC,
		tokenAddress: optimismUSDC,
		superTokenAddress: optimismUSDCx,
		multi: 1e6,
		key: 'hasOpUsdcApprove',
	},
	{
		coin: Coin.OPDAI,
		tokenAddress: optimismDAI,
		superTokenAddress: optimismDAIx,
		multi: 1e18,
		key: 'hasOpDaiApprove',
	},
	{
		coin: Coin.OP,
		tokenAddress: OPToken,
		superTokenAddress: OPx,
		multi: 1e18,
		key: 'hasOPApprove',
	},
	// {
	// 	coin: Coin.ETH,
	// 	tokenAddress: optimismETH,
	// 	superTokenAddress: optimismETHx,
	// 	multi: 1e18,
	// 	key: 'hasOpEthApprove',
	// },
];
