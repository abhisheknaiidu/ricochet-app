import { geckoMapping } from 'constants/coingeckoMapping';
import { Coin } from 'constants/coins';
import { useEffect, useRef, useState } from 'react';
import coingeckoApi from 'redux/slices/coingecko.slice';

export const useTokenHistory = (coins: Map<string, Coin[]>) => {
	const [coingeckoHistoryTrigger] = coingeckoApi.useLazyGetTokenHistoryQuery();
	const [coingeckoHistory, setCoingeckoHistory] = useState<Map<string, string[]>>(new Map());
	const dataLoaded = useRef(false);

	useEffect(() => {
		if (coins.size > 0) {
			const priceMap: Map<string, string[]> = new Map();
			for (const [key, value] of coins) {
				if (value[0] !== Coin.SELECT && value[1] !== Coin.SELECT) {
					const tokenIds = [geckoMapping[value[0]], geckoMapping[value[1]]];
					const tokenHistory = tokenIds.map(async (token) => await coingeckoHistoryTrigger(token));
					Promise.all(tokenHistory)
						.then((tokenHistory) => {
							tokenHistory.map((history) => {
								if (!history) return;
								priceMap.set(history?.originalArgs!, history?.data.prices || '');
							});
						})
						.finally(() => {
							setCoingeckoHistory(priceMap);
							dataLoaded.current = true;
						});
				}
			}
		}
	}, [coins]);

	useEffect(() => {
		if (dataLoaded.current) {
			dataLoaded.current = false;
		}
	}, [dataLoaded]);

	return coingeckoHistory;
};
