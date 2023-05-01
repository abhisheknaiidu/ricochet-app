import { Coin } from 'constants/coins';

export enum Color {

	ETH = '#B3FFFF',
	OPETH = '#B3FF11',
	OPETHx = '#B3FF22',
	ETHx = '#B3FF22',
	WSTETHx = '#B3FF22',
	WSTETH = '#B3FF22',
	WETH = '#B3FF22',
	WETHx = '#B3FF22',

	WBTC = '#F7931A',
	WBTCx = '#F7931A',
	OPBTC = '#F7931A',
	OPBTCx = '#F7931A',

	StIbAlluoBTC = '#F7931A',
	IbAlluoBTC = '#F7931A',

	OpRIC = '#7B7EFF',
	RIC = '#7B7EFF',
	MumbaiRIC = '#7B7EFF',
	
	USDC = '#2775CA',
	OPUSDC = '#2775CA',
	OPUSDCx = '#2775CA',
	FUSDC = '#2775CA',
	FUSDCx = '#2775CA',

	StIbAlluoETH = '#75E276',
	IbAlluoETH = '#75E276',

	IbAlluoUSD = '#FF8D8F',
	StIbAlluoUSD = '#FF8D8F',

	OP = '#FF0000',
	OPx = '#FF0000',

	DAIx = '#D5B608',
	FDAIx = '#D5B608',
	FDAI = '#D5B608',
	DAI = '#D5B608',
	OPDAI = '#D5B608',
	OPDAIx = '#D5B608',

	MATIC = '#9932CC',
	MATICx = '#9932CC',
}

export const colors: Record<string, string> = {
	[Coin.ETH]: Color.ETH,
	[Coin.OPETH]: Color.OPETH,
	[Coin.OPETHx]: Color.OPETHx,
	[Coin.ETHx]: Color.ETHx,
	[Coin.WSTETHx]: Color.WSTETHx,
	[Coin.WSTETH]: Color.WSTETH,
	[Coin.WETH]: Color.WETH,
	[Coin.WETHx]: Color.WETHx,
	[Coin.WBTC]: Color.WBTC,
	[Coin.WBTCx]: Color.WBTCx,
	[Coin.OPBTC]: Color.OPBTC,
	[Coin.OPBTCx]: Color.OPBTCx,
	[Coin.StIbAlluoBTC]: Color.StIbAlluoBTC,
	[Coin.IbAlluoBTC]: Color.IbAlluoBTC,
	[Coin.OpRIC]: Color.OpRIC,
	[Coin.RIC]: Color.RIC,
	[Coin.MumbaiRIC]: Color.MumbaiRIC,
	[Coin.USDC]: Color.USDC,
	[Coin.OPUSDC]: Color.OPUSDC,
	[Coin.OPUSDCx]: Color.OPUSDCx,
	[Coin.FUSDC]: Color.FUSDC,
	[Coin.FUSDCx]: Color.FUSDCx,
	[Coin.StIbAlluoETH]: Color.StIbAlluoETH,
	[Coin.IbAlluoETH]: Color.IbAlluoETH,
	[Coin.IbAlluoUSD]: Color.IbAlluoUSD,
	[Coin.StIbAlluoUSD]: Color.StIbAlluoUSD,
	[Coin.OP]: Color.OP,
	[Coin.OPx]: Color.OPx,
	[Coin.OPDAI]: Color.OPDAI,
	[Coin.DAI]: Color.DAI,
	[Coin.FDAI]: Color.FDAI,
	[Coin.DAIx]: Color.DAIx,
	[Coin.FDAIx]: Color.FDAIx,
	[Coin.MATIC]: Color.MATIC,
	[Coin.MATICx]: Color.MATICx
};
