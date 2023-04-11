import { Coin } from './coins';
import {
	DAIxAddress,
	DAIxETH,
	DAIxMATIC,
	DAIxUSDC,
	DAIxWBTC,
	ETHxDAI,
	ETHxUSDC,
	MATICxAddress,
	MATICxDAI,
	MATICxUSDC,
	RexHatAddress,
	RexShirtAddress,
	RICAddress,
	ricRexHatLaunchpadAddress,
	ricRexShirtLaunchpadAddress,
	StIbAlluoBTCAddress,
	StIbAlluoETHAddress,
	StIbAlluoUSDAddress,
	twoWayMarketDAIWETHAddress,
	twoWayMarketibAlluoUSDBTCAddress,
	twoWayMarketibAlluoUSDETHAddress,
	twoWayMarketMATICUSDCAddress,
	twoWayMarketRICUSDCAddress,
	twoWayMarketWBTCAddress,
	twoWayWETHMarketAddress,
	USDCxAddress,
	USDCxDAI,
	USDCxETH,
	usdcxibAlluoUSDAddress,
	USDCxMATIC,
	usdcxRicExchangeAddress,
	USDCxWBTC,
	WBTCxAddress,
	WBTCxDAI,
	WBTCxUSDC,
	WETHxAddress,
} from './polygon_config';

import { fUSDCxfDAI, fDAIxfUSDC, mumbaiRICAddress, fUSDCx, fDAIx, mumbaiLaunchpad } from './mumbai_config';

import {
	optimismLaunchpad,
	optimismRICAddress,
	optimismUSDCx,
	optimismUSDC,
	opUSDCxopDAI,
	optimismDAIx,
	OPToken,
	OPxUSDC,
	OPx,
	opDAIxopUSDC,
	USDCxOP,
} from './optimism_config';

// To-Do: Refactor this

export enum FlowEnum {
	twoWayusdcWethFlowQuery = 'twoWayusdcWethFlowQuery',
	twoWaywethUsdcFlowQuery = 'twoWaywethUsdcFlowQuery',
	twoWaywbtcUsdcFlowQuery = 'twoWaywbtcUsdcFlowQuery',
	twoWayusdcWbtcFlowQuery = 'twoWayusdcWbtcFlowQuery',
	twoWayWethDaiFlowQuery = 'twoWayWethDaiFlowQuery',
	twoWayDaiWethFlowQuery = 'twoWayDaiWethFlowQuery',
	twoWayRicUsdcFlowQuery = 'twoWayRicUsdcFlowQuery',
	twoWayUsdcRicFlowQuery = 'twoWayUsdcRicFlowQuery',
	twoWayMaticUsdcFlowQuery = 'twoWayMaticUsdcFlowQuery',
	twoWayUsdcMaticFlowQuery = 'twoWayUsdcMaticFlowQuery',
	twoWayIbUsdIbEthFlowQuery = 'twoWayIbUsdIbEthFlowQuery',
	twoWayIbEthIbUsdFlowQuery = 'twoWayIbEthIbUsdFlowQuery',
	twoWayIbUsdIbBTCFlowQuery = 'twoWayIbUsdIbBTCFlowQuery',
	twoWayIbBTCIbUsdFlowQuery = 'twoWayIbBTCIbUsdFlowQuery',
	usdcRicFlowQuery = 'usdcRicFlowQuery',
	ricRexShirtFlowQuery = 'ricRexShirtFlowQuery',
	ricRexHatFlowQuery = 'ricRexHatFlowQuery',
	usdcxibAlluoUSDFlowQuery = 'usdcxibAlluoUSDFlowQuery',
	fDAIxfUSDC = 'fDAIxfUSDC',
	fUSDCxfDAI = 'fUSDCxfDAI',
	opUSDCxopDAI = 'opUSDCxopDAI',
	opDAIxopUSDC = 'opDAIxopUSDC',
	OPxUSDC = 'OPxUSDC',
	USDCxOP = 'USDCxOP',
	USDCxDAI = 'USDCxDAI',
	DAIxUSDC = 'DAIxUSDC',
	USDCxETH = 'USDCxETH',
	ETHxUSDC = 'ETHxUSDC',
	DAIxETH = 'DAIxETH',
	ETHxDAI = 'ETHxDAI',
	USDCxWBTC = 'USDCxWBTC',
	WBTCxUSDC = 'WBTCxUSDC',
	DAIxWBTC = 'DAIxWBTC',
	WBTCxDAI = 'WBTCxDAI',
	USDCxMATIC = 'USDCxMATIC',
	MATICxUSDC = 'MATICxUSDC',
	DAIxMATIC = 'DAIxMATIC',
	MATICxDAI = 'MATICxDAI',
}

type IndexIDAType = {
	exchangeAddress: string;
	input: string;
	output: string;
	subsidy?: string;
	subsidyIndex?: number;
	inputIndex: number;
	outputIndex: number;
}[];

export enum FlowTypes {
	launchpad = 'launchpad',
	market = 'market',
	sushiLP = 'sushiLP',
}

export type InvestmentFlow = {
	superToken: string;
	tokenA: string;
	tokenB: string;
	coinA: Coin;
	coinB: Coin;
	flowKey: FlowEnum;
	type: FlowTypes;
};

// POLYGON

export const indexIDA: IndexIDAType = [
	{
		exchangeAddress: USDCxDAI,
		input: USDCxAddress,
		output: DAIxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},
	{
		exchangeAddress: DAIxUSDC,
		input: DAIxAddress,
		output: USDCxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},

	{
		exchangeAddress: USDCxETH,
		input: USDCxAddress,
		output: WETHxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},
	{
		exchangeAddress: ETHxUSDC,
		input: WETHxAddress,
		output: USDCxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},

	{
		exchangeAddress: ETHxDAI,
		input: WETHxAddress,
		output: DAIxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},
	{
		exchangeAddress: DAIxETH,
		input: DAIxAddress,
		output: WETHxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},

	{
		exchangeAddress: USDCxWBTC,
		input: USDCxAddress,
		output: WBTCxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},
	{
		exchangeAddress: WBTCxUSDC,
		input: WBTCxAddress,
		output: USDCxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},

	{
		exchangeAddress: DAIxWBTC,
		input: DAIxAddress,
		output: WBTCxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},
	{
		exchangeAddress: WBTCxDAI,
		input: WBTCxAddress,
		output: DAIxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},

	{
		exchangeAddress: DAIxMATIC,
		input: DAIxAddress,
		output: MATICxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},
	{
		exchangeAddress: MATICxDAI,
		input: MATICxAddress,
		output: DAIxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},

	{
		exchangeAddress: USDCxMATIC,
		input: USDCxAddress,
		output: MATICxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},
	{
		exchangeAddress: MATICxUSDC,
		input: MATICxAddress,
		output: USDCxAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},

	//V2 STUFF
	{
		exchangeAddress: usdcxRicExchangeAddress,
		input: USDCxAddress,
		output: RICAddress,
		subsidy: RICAddress,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: ricRexShirtLaunchpadAddress,
		input: RICAddress,
		output: RexShirtAddress,
		subsidy: RICAddress,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: ricRexHatLaunchpadAddress,
		input: RICAddress,
		output: RexHatAddress,
		subsidy: RICAddress,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: usdcxibAlluoUSDAddress,
		input: USDCxAddress,
		output: StIbAlluoUSDAddress,
		subsidy: RICAddress,
		subsidyIndex: 1,
		inputIndex: 0,
		outputIndex: 0,
	},

	//Mumbai
	{
		exchangeAddress: mumbaiLaunchpad,
		input: fUSDCx,
		output: mumbaiRICAddress,
		subsidy: mumbaiRICAddress,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: fUSDCxfDAI,
		input: fUSDCx,
		output: fDAIx,
		subsidy: mumbaiRICAddress,
		subsidyIndex: 1,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: fDAIxfUSDC,
		input: fDAIx,
		output: fUSDCx,
		subsidy: mumbaiRICAddress,
		subsidyIndex: 1,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	//Optimism
	{
		exchangeAddress: optimismLaunchpad,
		input: optimismUSDCx,
		output: optimismRICAddress,
		subsidy: optimismRICAddress,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: opUSDCxopDAI,
		input: optimismUSDCx,
		output: optimismDAIx,
		subsidy: optimismRICAddress,
		subsidyIndex: 1,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: opDAIxopUSDC,
		input: optimismDAIx,
		output: optimismUSDCx,
		subsidy: optimismRICAddress,
		subsidyIndex: 1,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: OPxUSDC,
		input: OPx,
		output: optimismUSDCx,
		subsidy: optimismRICAddress,
		subsidyIndex: 1,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
	{
		exchangeAddress: USDCxOP,
		input: optimismUSDCx,
		output: OPx,
		subsidy: optimismRICAddress,
		subsidyIndex: 1,
		inputIndex: 0, // just a placeholder, not used
		outputIndex: 0,
	},
];

const markets: InvestmentFlow[] = [
	{
		superToken: twoWayMarketibAlluoUSDETHAddress,
		tokenA: StIbAlluoETHAddress,
		tokenB: StIbAlluoUSDAddress,
		coinA: Coin.IbAlluoETH,
		coinB: Coin.IbAlluoUSD,
		flowKey: FlowEnum.twoWayIbEthIbUsdFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketibAlluoUSDETHAddress,
		tokenA: StIbAlluoUSDAddress,
		tokenB: StIbAlluoETHAddress,
		coinA: Coin.IbAlluoUSD,
		coinB: Coin.IbAlluoETH,
		flowKey: FlowEnum.twoWayIbUsdIbEthFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketibAlluoUSDBTCAddress,
		tokenA: StIbAlluoBTCAddress,
		tokenB: StIbAlluoUSDAddress,
		coinA: Coin.IbAlluoBTC,
		coinB: Coin.IbAlluoUSD,
		flowKey: FlowEnum.twoWayIbBTCIbUsdFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketibAlluoUSDBTCAddress,
		tokenA: StIbAlluoUSDAddress,
		tokenB: StIbAlluoBTCAddress,
		coinA: Coin.IbAlluoUSD,
		coinB: Coin.IbAlluoBTC,
		flowKey: FlowEnum.twoWayIbUsdIbBTCFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketRICUSDCAddress,
		tokenA: USDCxAddress,
		tokenB: RICAddress,
		coinA: Coin.USDC,
		coinB: Coin.RIC,
		flowKey: FlowEnum.twoWayUsdcRicFlowQuery,
		type: FlowTypes.market,
	},

	{
		superToken: usdcxibAlluoUSDAddress,
		tokenA: USDCxAddress,
		tokenB: StIbAlluoUSDAddress,
		coinA: Coin.USDC,
		coinB: Coin.IbAlluoUSD,
		flowKey: FlowEnum.usdcxibAlluoUSDFlowQuery,
		type: FlowTypes.market,
	},

	// V3 Markets
	{
		superToken: USDCxDAI,
		tokenA: USDCxAddress,
		tokenB: DAIxAddress,
		coinA: Coin.USDC,
		coinB: Coin.DAI,
		flowKey: FlowEnum.USDCxDAI,
		type: FlowTypes.market,
	},
	{
		superToken: DAIxUSDC,
		tokenA: DAIxAddress,
		tokenB: USDCxAddress,
		coinA: Coin.DAI,
		coinB: Coin.USDC,
		flowKey: FlowEnum.DAIxUSDC,
		type: FlowTypes.market,
	},
	{
		superToken: USDCxETH,
		tokenA: USDCxAddress,
		tokenB: WETHxAddress,
		coinA: Coin.USDC,
		coinB: Coin.ETH,
		flowKey: FlowEnum.USDCxETH,
		type: FlowTypes.market,
	},
	{
		superToken: ETHxUSDC,
		tokenA: WETHxAddress,
		tokenB: USDCxAddress,
		coinA: Coin.ETH,
		coinB: Coin.USDC,
		flowKey: FlowEnum.ETHxUSDC,
		type: FlowTypes.market,
	},
	{
		superToken: ETHxDAI,
		tokenA: WETHxAddress,
		tokenB: DAIxAddress,
		coinA: Coin.ETH,
		coinB: Coin.DAI,
		flowKey: FlowEnum.ETHxDAI,
		type: FlowTypes.market,
	},
	{
		superToken: DAIxETH,
		tokenA: DAIxAddress,
		tokenB: WETHxAddress,
		coinA: Coin.DAI,
		coinB: Coin.ETH,
		flowKey: FlowEnum.DAIxETH,
		type: FlowTypes.market,
	},
	{
		superToken: USDCxWBTC,
		tokenA: USDCxAddress,
		tokenB: WBTCxAddress,
		coinA: Coin.USDC,
		coinB: Coin.WBTC,
		flowKey: FlowEnum.USDCxWBTC,
		type: FlowTypes.market,
	},
	{
		superToken: WBTCxUSDC,
		tokenA: WBTCxAddress,
		tokenB: USDCxAddress,
		coinA: Coin.WBTC,
		coinB: Coin.USDC,
		flowKey: FlowEnum.WBTCxUSDC,
		type: FlowTypes.market,
	},
	{
		superToken: DAIxWBTC,
		tokenA: DAIxAddress,
		tokenB: WBTCxAddress,
		coinA: Coin.DAI,
		coinB: Coin.WBTC,
		flowKey: FlowEnum.DAIxWBTC,
		type: FlowTypes.market,
	},
	{
		superToken: WBTCxDAI,
		tokenA: WBTCxAddress,
		tokenB: DAIxAddress,
		coinA: Coin.WBTC,
		coinB: Coin.DAI,
		flowKey: FlowEnum.WBTCxDAI,
		type: FlowTypes.market,
	},
	{
		superToken: USDCxMATIC,
		tokenA: USDCxAddress,
		tokenB: MATICxAddress,
		coinA: Coin.USDC,
		coinB: Coin.MATIC,
		flowKey: FlowEnum.USDCxMATIC,
		type: FlowTypes.market,
	},
	{
		superToken: MATICxUSDC,
		tokenA: MATICxAddress,
		tokenB: USDCxAddress,
		coinA: Coin.MATIC,
		coinB: Coin.USDC,
		flowKey: FlowEnum.MATICxUSDC,
		type: FlowTypes.market,
	},
	{
		superToken: DAIxMATIC,
		tokenA: DAIxAddress,
		tokenB: MATICxAddress,
		coinA: Coin.DAI,
		coinB: Coin.MATIC,
		flowKey: FlowEnum.DAIxMATIC,
		type: FlowTypes.market,
	},
	{
		superToken: MATICxDAI,
		tokenA: MATICxAddress,
		tokenB: DAIxAddress,
		coinA: Coin.MATIC,
		coinB: Coin.DAI,
		flowKey: FlowEnum.MATICxDAI,
		type: FlowTypes.market,
	},

	// V2 Markets
	{
		superToken: twoWayWETHMarketAddress,
		tokenA: USDCxAddress,
		tokenB: WETHxAddress,
		coinA: Coin.USDC,
		coinB: Coin.WETH,
		flowKey: FlowEnum.twoWayusdcWethFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketWBTCAddress,
		tokenA: USDCxAddress,
		tokenB: WBTCxAddress,
		coinA: Coin.USDC,
		coinB: Coin.WBTC,
		flowKey: FlowEnum.twoWayusdcWbtcFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketDAIWETHAddress,
		tokenA: DAIxAddress,
		tokenB: WETHxAddress,
		coinA: Coin.DAI,
		coinB: Coin.WETH,
		flowKey: FlowEnum.twoWayDaiWethFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayWETHMarketAddress,
		tokenA: WETHxAddress,
		tokenB: USDCxAddress,
		coinA: Coin.WETH,
		coinB: Coin.USDC,
		flowKey: FlowEnum.twoWaywethUsdcFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketWBTCAddress,
		tokenA: WBTCxAddress,
		tokenB: USDCxAddress,
		coinA: Coin.WBTC,
		coinB: Coin.USDC,
		flowKey: FlowEnum.twoWaywbtcUsdcFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketDAIWETHAddress,
		tokenA: WETHxAddress,
		tokenB: DAIxAddress,
		coinA: Coin.WETH,
		coinB: Coin.DAI,
		flowKey: FlowEnum.twoWayWethDaiFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketRICUSDCAddress,
		tokenA: RICAddress,
		tokenB: USDCxAddress,
		coinA: Coin.RIC,
		coinB: Coin.USDC,
		flowKey: FlowEnum.twoWayRicUsdcFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketMATICUSDCAddress,
		tokenA: MATICxAddress,
		tokenB: USDCxAddress,
		coinA: Coin.MATIC,
		coinB: Coin.USDC,
		flowKey: FlowEnum.twoWayMaticUsdcFlowQuery,
		type: FlowTypes.market,
	},
	{
		superToken: twoWayMarketMATICUSDCAddress,
		tokenA: USDCxAddress,
		tokenB: MATICxAddress,
		coinA: Coin.USDC,
		coinB: Coin.MATIC,
		flowKey: FlowEnum.twoWayUsdcMaticFlowQuery,
		type: FlowTypes.market,
	},
];

const liquidityMarkets: InvestmentFlow[] = [
	// {
	//   superToken: usdcxEthSlpxExchangeAddress,
	//   tokenA: USDCxAddress,
	//   tokenB: rexLPETHAddress,
	//   coinA: Coin.USDC,
	//   coinB: Coin.SLP,
	//   flowKey: FlowEnum.usdcSlpEthFlowQuery,
	//   type: FlowTypes.sushiLP,
	// },
];

export const launchpads: InvestmentFlow[] = [
	{
		superToken: usdcxRicExchangeAddress,
		tokenA: USDCxAddress,
		tokenB: RICAddress,
		coinA: Coin.USDC,
		coinB: Coin.RIC,
		flowKey: FlowEnum.usdcRicFlowQuery,
		type: FlowTypes.launchpad,
	},
	// {
	// 	superToken: ricRexShirtLaunchpadAddress,
	// 	tokenA: RICAddress,
	// 	tokenB: RexShirtAddress,
	// 	coinA: Coin.RIC,
	// 	coinB: Coin.REXSHIRT,
	// 	flowKey: FlowEnum.ricRexShirtFlowQuery,
	// 	type: FlowTypes.launchpad,
	// },
	// {
	// 	superToken: ricRexHatLaunchpadAddress,
	// 	tokenA: RICAddress,
	// 	tokenB: RexHatAddress,
	// 	coinA: Coin.RIC,
	// 	coinB: Coin.REXHAT,
	// 	flowKey: FlowEnum.ricRexHatFlowQuery,
	// 	type: FlowTypes.launchpad,
	// },
];

export const flowConfig: InvestmentFlow[] = [...markets, ...liquidityMarkets, ...launchpads];

// MUMBAI

export const mumbaiIndexIDA: IndexIDAType = [
	{
		exchangeAddress: fDAIxfUSDC,
		input: fDAIx,
		output: fUSDCx,
		subsidy: mumbaiRICAddress,
		subsidyIndex: 2,
		inputIndex: 1,
		outputIndex: 0,
	},
	{
		exchangeAddress: fUSDCxfDAI,
		input: fUSDCx,
		output: fDAIx,
		subsidy: mumbaiRICAddress,
		subsidyIndex: 2,
		inputIndex: 1,
		outputIndex: 0,
	},
];

export const mumbaiMarkets: InvestmentFlow[] = [
	{
		superToken: fDAIxfUSDC,
		tokenA: fDAIx,
		tokenB: fUSDCx,
		coinA: Coin.FDAI,
		coinB: Coin.FUSDC,
		flowKey: FlowEnum.fDAIxfUSDC,
		type: FlowTypes.market,
	},
	{
		superToken: fUSDCxfDAI,
		tokenA: fUSDCx,
		tokenB: fDAIx,
		coinA: Coin.FUSDC,
		coinB: Coin.FDAI,
		flowKey: FlowEnum.fUSDCxfDAI,
		type: FlowTypes.market,
	},
];

export const mumbaiLaunchpads: InvestmentFlow[] = [
	{
		superToken: mumbaiLaunchpad,
		tokenA: fUSDCx,
		tokenB: mumbaiRICAddress,
		coinA: Coin.USDC,
		coinB: Coin.RIC,
		flowKey: FlowEnum.usdcRicFlowQuery,
		type: FlowTypes.launchpad,
	},
];

export const optimismLaunchpads: InvestmentFlow[] = [
	{
		superToken: optimismLaunchpad,
		tokenA: optimismUSDCx,
		tokenB: optimismRICAddress,
		coinA: Coin.USDC,
		coinB: Coin.RIC,
		flowKey: FlowEnum.usdcRicFlowQuery,
		type: FlowTypes.launchpad,
	},
];

export const optimismMarkets: InvestmentFlow[] = [
	{
		superToken: opUSDCxopDAI,
		tokenA: optimismUSDCx,
		tokenB: optimismDAIx,
		coinA: Coin.OPUSDC,
		coinB: Coin.OPDAI,
		flowKey: FlowEnum.opUSDCxopDAI,
		type: FlowTypes.market,
	},
	{
		superToken: opDAIxopUSDC,
		tokenA: optimismDAIx,
		tokenB: optimismUSDCx,
		coinA: Coin.OPDAI,
		coinB: Coin.OPUSDC,
		flowKey: FlowEnum.opDAIxopUSDC,
		type: FlowTypes.market,
	},
	{
		superToken: OPxUSDC,
		tokenA: OPx,
		tokenB: optimismUSDCx,
		coinA: Coin.OP,
		coinB: Coin.OPUSDC,
		flowKey: FlowEnum.OPxUSDC,
		type: FlowTypes.market,
	},
	{
		superToken: USDCxOP,
		tokenA: optimismUSDCx,
		tokenB: OPx,
		coinA: Coin.OPUSDC,
		coinB: Coin.OP,
		flowKey: FlowEnum.USDCxOP,
		type: FlowTypes.market,
	},
];

export const optimismFlowConfig: InvestmentFlow[] = [...optimismMarkets, ...optimismLaunchpads];

export const mumbaiFlowConfig: InvestmentFlow[] = [...mumbaiMarkets, ...mumbaiLaunchpads];

export const combinedFlowConfig: InvestmentFlow[] = [...flowConfig, ...mumbaiFlowConfig, ...optimismFlowConfig];

export const flowDirectory: { [key: number]: InvestmentFlow[] } = {
	10: optimismFlowConfig,
	137: flowConfig,
	80001: mumbaiFlowConfig,
};

export const getFlowDirectory = (networkId: number) => {
	return flowDirectory[networkId];
};
