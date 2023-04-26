import { Coin } from './coins';
import {
	MATICxAddress,
	USDCxAddress,
	WETHxAddress,
	WBTCxAddress,
	RICAddress,
	DAIAddress,
	DAIxAddress,
	USDCAddress,
	WETHAddress,
	WBTCAddress,
	IbAlluoETHAddress,
	StIbAlluoETHAddress,
	IbAlluoUSDAddress,
	StIbAlluoUSDAddress,
	IbAlluoBTCAddress,
	StIbAlluoBTCAddress,
} from './polygon_config';

import {
	fUSDC,
	fDAI,
	fUSDCx,
	fDAIx,
} from './mumbai_config';

import { OPToken, optimismDAI, optimismDAIx, optimismUSDC, optimismUSDCx, OPx, opBTCx, wstETHx } from './optimism_config';

type Transformer = {
	token: string;
	coin: Coin;
};

export const tokenCoinTransformer: Transformer[] = [
	{
		token: IbAlluoETHAddress,
		coin: Coin.IbAlluoETH,
	},
	{
		token: StIbAlluoETHAddress,
		coin: Coin.StIbAlluoETH,
	},
	{
		token: IbAlluoBTCAddress,
		coin: Coin.IbAlluoBTC,
	},
	{
		token: StIbAlluoBTCAddress,
		coin: Coin.StIbAlluoBTC,
	},
	{
		token: IbAlluoUSDAddress,
		coin: Coin.IbAlluoUSD,
	},
	{
		token: StIbAlluoUSDAddress,
		coin: Coin.StIbAlluoUSD,
	},
	{
		token: MATICxAddress,
		coin: Coin.MATICx,
	},
	{
		token: USDCAddress,
		coin: Coin.USDC,
	},
	{
		token: USDCxAddress,
		coin: Coin.USDCx,
	},
	{
		token: WETHAddress,
		coin: Coin.WETH,
	},
	{
		token: WETHxAddress,
		coin: Coin.WETHx,
	},
	{
		token: WBTCAddress,
		coin: Coin.WBTC,
	},
	{
		token: WBTCxAddress,
		coin: Coin.WBTCx,
	},
	{
		token: RICAddress,
		coin: Coin.RIC,
	},
	{
		token: DAIAddress,
		coin: Coin.DAI,
	},
	{
		token: DAIxAddress,
		coin: Coin.DAIx,
	},
	{
		token: fDAIx,
		coin: Coin.FDAIx,
	},
	{
		token: fUSDCx,
		coin: Coin.FUSDCx,
	},
	{
		token: fUSDC,
		coin: Coin.FUSDC,
	},
	{
		token: fDAI,
		coin: Coin.FDAI,
	},
	{
		token: OPToken,
		coin: Coin.OP,
	},
	{
		token: OPx,
		coin: Coin.OPx,
	},
	{
		token: optimismUSDCx,
		coin: Coin.OPUSDCx,
	},
	{
		token: optimismUSDC,
		coin: Coin.OPUSDC,
	},
	{
		token: optimismDAI,
		coin: Coin.OPDAI,
	},
	{
		token: optimismDAIx,
		coin: Coin.OPDAIx,
	},
	{
		token: opBTCx,
		coin: Coin.OPBTCx,
	},
	{
		token: wstETHx,
		coin: Coin.WSTETHx,
	}
];
