import { readContract } from '@wagmi/core';
import { streamExchangeABI } from 'constants/ABIs/streamExchange';
import { InvestmentFlow } from 'constants/flowConfig';
import {
	twoWayMarketibAlluoUSDETHAddress,
	usdcxibAlluoUSDAddress,
	twoWayMarketibAlluoUSDBTCAddress,
	twoWayWETHMarketAddress,
	twoWayMarketWBTCAddress,
	twoWayMarketDAIWETHAddress,
	twoWayMarketMATICUSDCAddress,
} from 'constants/polygon_config';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export const useGetRicRewards = (
	sortedList: InvestmentFlow[],
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
	const [emissionRateMap, setEmissionRateMap] = useState<Map<string, string>>(new Map());
	const [aggregatedRewards, setAggregatedRewards] = useState<number[]>([0]);
	const [aggregatedRICRewards, setAggregatedRICRewards] = useState<number>(0);
	const [ricRewardLoading, setRicRewardLoading] = useState<boolean>(false);

	const contractAddressAllowed = (address: string) => {
		const eligibleAddresses = [
			twoWayMarketibAlluoUSDETHAddress,
			usdcxibAlluoUSDAddress,
			twoWayMarketibAlluoUSDBTCAddress,
			twoWayWETHMarketAddress,
			twoWayMarketWBTCAddress,
			twoWayMarketDAIWETHAddress,
			twoWayMarketMATICUSDCAddress,
		];
		if (eligibleAddresses.includes(address)) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		if (sortedList.length) {
			setRicRewardLoading(true);
			const rateMap: Map<string, string> = new Map();
			(async () =>
				await Promise.all(
					sortedList.map(async (market) => {
						if (contractAddressAllowed(market.superToken)) {
							await readContract({
								address: market.superToken as `0x${string}`,
								abi: streamExchangeABI,
								functionName: chain?.id === 137 ? 'getOutputPool' : 'outputPools',
								args: chain?.id === 137 ? [3] : [1],
							})
								.then((res: any) => {
									const finRate = ((Number(res.emissionRate) / 1e18) * 2592000).toFixed(4);
									rateMap.set(market.superToken, finRate.toString());
								})
								.catch((error: any) => {
									console.log('error', error);
								});
						}
					})
				).then((res) => setEmissionRateMap(rateMap)))();
		}
	}, [sortedList, chain?.id]);

	useEffect(() => {
		if (sortedList.length && queries.size > 0 && emissionRateMap.size > 0) {
			sortedList.map((market) => {
				const subsidy_rate =
					(+queries.get(market.flowKey)?.placeholder! / +queries.get(market.flowKey)?.flowsOwned!) * 100;
				const received_reward = (+subsidy_rate / 100) * +emissionRateMap.get(market.superToken)!;
				if (received_reward) {
					setAggregatedRewards((aggregatedRewards) => [...aggregatedRewards, received_reward]);
				}
			});
		}
	}, [emissionRateMap, queries, sortedList, chain?.id]);

	useEffect(() => {
		if (aggregatedRewards.length) {
			const aggregated = aggregatedRewards
				.filter((reward, index, self) => self.indexOf(reward) === index)
				.reduce((accumulator, reward) => accumulator + reward, 0);
			setAggregatedRICRewards(aggregated);
			setRicRewardLoading(false);
		}
	}, [aggregatedRewards, chain?.id]);

	return { aggregatedRICRewards, ricRewardLoading };
};