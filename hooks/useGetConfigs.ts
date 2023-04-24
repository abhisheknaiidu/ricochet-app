import { InvestmentFlow, getFlowDirectory } from 'constants/flowConfig';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export const useGetConfigs = () => {
	const { chain } = useNetwork();
	const [configs, setConfigs] = useState<InvestmentFlow[]>();

	useEffect(() => {
		setConfigs(getFlowDirectory(chain?.id!));
	}, [chain?.id]);

	return configs;
};
