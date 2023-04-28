import { getNetFlowRate } from '@richochet/utils/getNetFlowRate';
import Big from 'big.js';
import { InvestmentFlow } from 'constants/flowConfig';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useProvider } from 'wagmi';
import { polygon } from 'wagmi/chains';

export const useGetNewFlowRate = (positions: InvestmentFlow[], usdPrice: Big) => {
	const { chain } = useNetwork();
	const provider = useProvider({ chainId: chain?.id || polygon.id });
	const { address, isConnected } = useAccount();
	const [usdFlowRate, setUsdFlowRate] = useState<string>('0');
	const [usdFlowRateLoading, setUsdFlowRateLoading] = useState<boolean>(true);
	useEffect(() => {
		if (isConnected && usdPrice && chain?.id && positions.length > 0) {
			(async () => {
				const { flowRate, loading } = await getNetFlowRate(usdPrice, chain, positions, address!, provider);
				setUsdFlowRate(flowRate);
				setUsdFlowRateLoading(!loading);
			})();
		}
		setUsdFlowRateLoading(false);
	}, [isConnected, positions, usdPrice]);

	return { usdFlowRate, usdFlowRateLoading };
};