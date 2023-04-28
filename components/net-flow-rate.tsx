import { useGetNewFlowRate } from '@richochet/hooks/useGetNetFlowRate';
import { formatCurrency } from '@richochet/utils/helperFunctions';
import Big from 'big.js';
import { InvestmentFlow } from 'constants/flowConfig';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
	positions: InvestmentFlow[];
	usdPrice: Big;
}

export const NetFlowRate: NextPage<Props> = ({ positions, usdPrice }): JSX.Element => {
	const { t } = useTranslation('home');
	const [loading, setLoading] = useState<boolean>(true);
	const { usdFlowRate, usdFlowRateLoading } = useGetNewFlowRate(positions, usdPrice);

	useEffect(() => {
		setLoading(usdFlowRateLoading);
	}, [usdFlowRateLoading]);

	if (loading) {
		return (
			<div className='animate-pulse'>
				<div className='h-4 rounded bg-slate-700'></div>
			</div>
		);
	}

	return (
		<>
			{!loading && usdFlowRate && (
				<p className='text-slate-100 font-light text-2xl'>
					{formatCurrency(parseFloat(usdFlowRate!))} / {t('month')}
				</p>
			)}
		</>
	);
};