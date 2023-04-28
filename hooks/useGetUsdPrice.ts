import Big from 'big.js';
import { useEffect, useState } from 'react';
import coingeckoApi from 'redux/slices/coingecko.slice';
import { useAccount, useNetwork } from 'wagmi';

export const useGetUsdPrice = () => {
	const { chain } = useNetwork();
	const [usdPrice, setUsdPrice] = useState<Big>(new Big(0));
	const { address, isConnected } = useAccount();
	const {
		data: tokenPrice,
		isLoading: tokenPriceIsLoading,
		isSuccess: tokenPriceIsSuccess,
		isError: tokenPriceIsError,
		error: tokenPriceError,
	} = coingeckoApi.useGetTokenPriceQuery('richochet');

	useEffect(() => {
		if (isConnected && tokenPrice && tokenPriceIsSuccess) {
			setUsdPrice(new Big(parseFloat(tokenPrice?.richochet?.usd)));
		}
		if (tokenPriceIsError) {
			console.error(tokenPriceError);
		}
	}, [isConnected, address, tokenPrice, tokenPriceIsSuccess, chain?.id]);

	return usdPrice;
};