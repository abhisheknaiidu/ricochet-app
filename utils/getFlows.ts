import { FlowEnum } from 'constants/flowConfig';
import { Flow } from 'types/flow';
import { buildFlowQuery } from './buildFlowQuery';

export const getFlows = (
	streamedSoFarMap: Record<string, number>,
	receivedSoFarMap: Record<string, number>,
	exchangeContractsAddresses: string[],
	results: {
		flowsOwned: Flow[];
		flowsReceived: Flow[];
	}[],
	address: `0x${string}`
) => {
	const flows: Map<string, { inflows: Flow[]; outflows: Flow[] }> = new Map();
	exchangeContractsAddresses.forEach((el, i) => {
		if (results.length > 0) {
			if (results[i] !== null) {
				//@ts-ignore
				flows.set(el, results[i]);
			} else {
				flows.set(el, { inflows: [], outflows: [] });
			}
		}
	});
	let flowQueries: Map<
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
	> = new Map();
	if (flows.size > 0) {
		for (const [key, value] of Object.entries(FlowEnum)) {
			flowQueries.set(value, buildFlowQuery(value, address, flows, streamedSoFarMap, receivedSoFarMap));
		}
	}
	return flowQueries;
};