import { getFlowUSDValue } from '@richochet/utils/getFlowUsdValue';
import { FlowTypes, InvestmentFlow } from 'constants/flowConfig';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export const useGetSortedList = (
	coingeckoPrices: Map<string, number>,
	configs: InvestmentFlow[] | undefined,
	queries: Map<
		string,
		{
			flowKey: string;
			flowsReceived: number;
			flowsOwned: string;
			totalFlows: number;
			placeholder: string;
			subsidyRate: {
				perso: number;
				total: number;
				endDate: string;
			};
			streamedSoFar?: number | undefined;
			receivedSoFar?: number | undefined;
		}
	>
) => {
	const { chain } = useNetwork();
	const [sortedList, setSortedList] = useState<InvestmentFlow[]>([]);

	useEffect(() => {
		if (coingeckoPrices.size > 0 && queries.size > 0 && configs) {
			let list = configs.filter((each) => each.type === FlowTypes.market);
			let sortList = list.sort((a, b) => {
				const totalVolumeA = parseFloat(getFlowUSDValue(a, queries, coingeckoPrices));
				const totalVolumeB = parseFloat(getFlowUSDValue(b, queries, coingeckoPrices));
				return totalVolumeB - totalVolumeA;
			});
			setSortedList(sortList);
		}
	}, [queries, coingeckoPrices, chain?.id, configs]);

	return sortedList;
};