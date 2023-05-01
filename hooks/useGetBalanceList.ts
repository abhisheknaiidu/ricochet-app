import { getSuperTokenBalances } from '@richochet/utils/getSuperTokenBalances';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export const useGetBalanceList = () => {
	const { chain } = useNetwork();
	const { address, isConnected } = useAccount();
	const [balanceList, setBalanceList] = useState<Record<string, string>>({});

	useEffect(() => {
		if (isConnected) getSuperTokenBalances(address!).then((res) => setBalanceList(res));
	}, [address, isConnected, chain?.id]);

	return balanceList;
};
