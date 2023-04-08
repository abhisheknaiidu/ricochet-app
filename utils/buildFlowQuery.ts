import { combinedFlowConfig } from 'constants/flowConfig';
import { Flow } from 'types/flow';
import { getOwnedFlows } from './getOwnedFlows';
import { getReceviedFlows } from './getReceviedFlows';

export const buildFlowQuery = (
	flowKey: string,
	address: string,
	flows: Map<string, { inflows: Flow[]; outflows: Flow[] }>,
	streamedSoFarMap: Record<string, number>,
	receivedSoFarMap: Record<string, number>
) => {
	const flowConfigObject = combinedFlowConfig.find((o) => o.flowKey === flowKey);
	const exchangeAddress = flowConfigObject?.superToken || '';
	const tokenAxAddress = flowConfigObject?.tokenA || '';
	const tokenAtokenBFlows = flows.get(exchangeAddress)!;
	const tokenAtokenBFlowsReceived = getReceviedFlows(tokenAtokenBFlows?.inflows, tokenAxAddress, address);
	let streamedSoFar;
	let receivedSoFar;

	if (Object.keys(streamedSoFarMap).length > 0) {
		streamedSoFar = streamedSoFarMap[`${tokenAxAddress.toLowerCase()}-${exchangeAddress.toLowerCase()}`];
	}

	if (Object.keys(receivedSoFarMap).length > 0) {
		receivedSoFar = receivedSoFarMap[`${tokenAxAddress.toLowerCase()}-${exchangeAddress.toLowerCase()}`];
	}

	const tokenAtokenBPlaceholder = ((tokenAtokenBFlowsReceived / 10 ** 18) * (30 * 24 * 60 * 60)).toFixed(6);
	const flowsOwned = getOwnedFlows(tokenAtokenBFlows?.inflows, tokenAxAddress);
	const subsidyRate = { perso: 0, total: 0, endDate: 'unknown' };
	const totalFlows = tokenAtokenBFlows?.inflows.filter((inflow) => inflow.currentFlowRate !== "0")

	return {
		flowKey,
		flowsReceived: tokenAtokenBFlowsReceived,
		flowsOwned,
		totalFlows: totalFlows?.length || 0,
		placeholder: tokenAtokenBPlaceholder,
		streamedSoFar,
		receivedSoFar,
		subsidyRate, // await getSubsidyRate(FlowEnum.daiMkrFlowQuery,
		// usdcRicPlaceholder, flowsOwned),
	};
};
