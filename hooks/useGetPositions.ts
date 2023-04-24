import { InvestmentFlow } from 'constants/flowConfig';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export const useGetPositions = (
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
	const { isConnected, address } = useAccount();
	const [positions, setPositions] = useState<InvestmentFlow[]>([]);

	useEffect(() => {
		if (isConnected && address && configs && configs?.length > 0) {
			const positions = configs.filter(({ flowKey }) => parseFloat(queries.get(flowKey)?.placeholder!) > 0);
			setPositions(positions);
		}
	}, [queries, address, isConnected, , configs, chain?.id]);

	return positions;
};
