import { getFlows } from '@richochet/utils/getFlows';
import { getReceived } from '@richochet/utils/getReceived';
import { getStreams } from '@richochet/utils/getStreams';
import { getSubgraphUrl } from '@richochet/utils/getSubgraphUrl';
import { useEffect, useState } from 'react';
import superfluidSubgraphApi from 'redux/slices/superfluidSubgraph.slice';
import { Flow } from 'types/flow';
import { useAccount, useNetwork } from 'wagmi';

export const useSweepQueryFlows = (
	results: {
		flowsOwned: Flow[];
		flowsReceived: Flow[];
	}[],
	exchangeContractsAddresses: string[]
) => {
	const { chain } = useNetwork();
	const { address, isConnected } = useAccount();
	const [queryStreams] = superfluidSubgraphApi.useQueryStreamsMutation();
	const [queryReceived] = superfluidSubgraphApi.useQueryReceivedMutation();
	const [queries, setQueries] = useState<
		Map<
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
		>
	>(new Map());

	useEffect(() => {
		if (results.length > 0) {
			(async () => {
				const streamedSoFarMap: Record<string, number> = {};
				const receivedSoFarMap: Record<string, number> = {};
				if (address) {
					await queryStreams({ address, network: getSubgraphUrl(chain?.id!) }).then((res: any) => {
						getStreams(res?.data?.data?.streams, streamedSoFarMap);
					});
					await queryReceived({ receiver: address, network: getSubgraphUrl(chain?.id!) }).then((res: any) => {
						getReceived(res?.data?.data?.streams, receivedSoFarMap);
					});
				}
				const flowQueries = getFlows(
					streamedSoFarMap,
					receivedSoFarMap,
					exchangeContractsAddresses,
					results,
					address as `0x${string}`
				);
				setQueries(flowQueries);
			})();
		}
	}, [chain?.id, isConnected, results]);

	return queries;
};