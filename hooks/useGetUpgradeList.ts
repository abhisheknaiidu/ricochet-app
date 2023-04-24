import { mumbaiUpgradeTokensList, upgradeTokensList, optimismUpgradeTokensList } from 'constants/upgradeConfig';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export const useGetUpgradeList = () => {
	const { chain } = useNetwork();
	const [upgradeList, setUpgradeList] = useState<any>();

	useEffect(() => {
		if (!chain) return;
		if (chain?.id === 80001) {
			setUpgradeList(mumbaiUpgradeTokensList);
		}
		if (chain?.id === 137) {
			setUpgradeList(upgradeTokensList);
		}
		if (chain?.id === 10) {
			setUpgradeList(optimismUpgradeTokensList);
		}
	}, [chain?.id]);

	return upgradeList;
};
