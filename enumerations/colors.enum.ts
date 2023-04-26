import { Coin } from 'constants/coins';

export enum Color {
	ETH = '#B3FFFF',
	OPETH = '#B3FF11',
	WSTETH = '#B3FF22',
	WBTC = '#FF8D8F',
	RIC = '#7B7EFF',
	USDC = '#2775CA',
	StIbAlluoETH = '#75E276',
	StIbAlluoUSD = '#E9DF89',
	OP = '#ff0000',
	OPx = '#ff0000',
	DAI = '#d5b608',
	OPDAI = '#d5b608',
	OPDAIx = '#d5b608',
}

export const colors: Record<string, string> = {
	[Coin.ETH]: Color.ETH,
	[Coin.OPETH]: Color.OPETH,
	[Coin.WSTETH]: Color.WSTETH,
	[Coin.WBTC]: Color.WBTC,
	[Coin.RIC]: Color.RIC,
	[Coin.USDC]: Color.USDC,
	[Coin.StIbAlluoUSD]: Color.StIbAlluoUSD,
	[Coin.StIbAlluoETH]: Color.StIbAlluoETH,
	[Coin.OP]: Color.OP,
	[Coin.OPx]: Color.OPx,
	[Coin.OPDAI]: Color.OPDAI,
	[Coin.DAI]: Color.DAI,
};
