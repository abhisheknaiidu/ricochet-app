import { geckoMapping } from 'constants/coingeckoMapping';
import { useEffect, useState } from 'react';
import coingeckoApi from 'redux/slices/coingecko.slice';
import { useAccount, useNetwork } from 'wagmi';

export const useGetPositionTotal = (balanceList: Record<string, string>, upgradeList: any) => {
	const { chain } = useNetwork();
	const { address, isConnected } = useAccount();
	const [positionTotal, setPositionTotal] = useState<number>(0);
	const [positionTotalLoading, setPositionTotalLoading] = useState<boolean>(false);
	const {
		data: tokens,
		isSuccess: tokensIsSuccess,
		isError: tokensIsError,
		error: tokensError,
		//@ts-ignore
	} = coingeckoApi.useGetUpgradedTokensListQuery();

	useEffect(() => {
		if (isConnected && tokensIsError) console.error(tokensError);
		if (isConnected && tokensIsSuccess && upgradeList) {
			setPositionTotalLoading(true);
			const totalInPositions = upgradeList.reduce((total: any, token: any) => {
				const balancess =
					Object.keys(balanceList).length &&
					tokens &&
					Object.keys(geckoMapping).length &&
					(
						parseFloat(balanceList[token.superTokenAddress]) *
						parseFloat((tokens as any)[(geckoMapping as any)[token.coin]].usd)
					).toFixed(6);
				if (isNaN(+balancess)) return total + 0;
				return total + parseFloat(balancess);
			}, 0);
			setPositionTotal(totalInPositions);
			setPositionTotalLoading(false);
		}
	}, [isConnected, address, balanceList, tokens, tokensIsSuccess, chain?.id, upgradeList]);

	return { positionTotal, positionTotalLoading, tokens };
};