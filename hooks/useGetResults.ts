import { getSubgraphUrl } from '@richochet/utils/getSubgraphUrl';
import { useEffect, useState } from 'react';
import superfluidSubgraphApi from 'redux/slices/superfluidSubgraph.slice';
import { Flow } from 'types/flow';
import { useNetwork } from 'wagmi';

export const useGetResults = (exchangeContractsAddresses: string[]) => {
	const { chain } = useNetwork();
	const [results, setResults] = useState<{ flowsOwned: Flow[]; flowsReceived: Flow[] }[]>([]);
	const [queryFlows] = superfluidSubgraphApi.useQueryFlowsMutation();

	useEffect(() => {
		const results = exchangeContractsAddresses.map(
			async (addr) =>
				await queryFlows({ queryAddress: addr, network: getSubgraphUrl(chain?.id! || 137) }).then((res: any) => {
					return res?.data?.data?.account;
				})
		);
		Promise.all(results).then((res) => setResults(res));
	}, [chain?.id]);

	return results;
};