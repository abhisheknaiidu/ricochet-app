import { RectangleGroupIcon } from '@heroicons/react/24/solid';
import AlertAction from '@richochet/utils/alertAction';
import Big from 'big.js';
import { FlowTypes, InvestmentFlow } from 'constants/flowConfig';
import { RICAddress, USDCAddress } from 'constants/polygon_config';
import { launchpads, mumbaiLaunchpads, optimismLaunchpads } from 'constants/flowConfig';
import { AlertContext } from 'contexts/AlertContext';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useState } from 'react';
import streamApi from 'redux/slices/streams.slice';
import { useAccount, useNetwork } from 'wagmi';
import { SolidButton } from './button';

export const LaunchPad = () => {
	const { t } = useTranslation('home');
	const [state, dispatch] = useContext(AlertContext);
	const { isConnected } = useAccount();
	const { chain } = useNetwork()
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [config, setConfig] = useState<InvestmentFlow>(launchpads[0]);
	const [shareScaler, setShareScaler] = useState<number>(1e3);
	const [startStreamTrigger] = streamApi.useLazyStartStreamQuery();
	const navigateToUniswap = () => {
		const url = `https://app.uniswap.org/#/swap?theme=dark&inputCurrency=${USDCAddress}&outputCurrency=${RICAddress}&exactAmount=100000&exactField=output`;
		window.open(url, '_blank');
	};

	useEffect(() => {
		if (!chain) return;
		if (chain.id === 80001) {
			setConfig(mumbaiLaunchpads[0]);
		}
		if (chain.id === 10) {
			setConfig(optimismLaunchpads[0])
		}
	}, [chain])

	const handleStartPosition = () => {
		if (!config || !shareScaler) {
			dispatch(
				AlertAction.showErrorAlert('Oops!', 'We were unable to find the selected position. Please try another one.')
			);
			setTimeout(() => {
				dispatch(AlertAction.hideAlert());
			}, 5000);
			return;
		}
		setIsLoading(true);
		dispatch(AlertAction.showLoadingAlert('Waiting for your transaction to be confirmed...', ''));
		if (!shareScaler) return;
		let newAmount = '20';
		if (config?.type === FlowTypes.launchpad) {
			const valueBig = new Big(newAmount);
			const resultBig = valueBig
				.div(2592000)
				.times(1e18)
				.div(shareScaler)
				.round(0, 0)
				.times(shareScaler)
				.div(1e18)
				.times(259200)
				.div(3600)
				.div(24)
				.div(30)
				.times(10);
			newAmount = resultBig.toFixed();
		}
		const stream = startStreamTrigger({ amount: newAmount, config });
		stream
			.then((response) => {
				if (response.isSuccess) {
					dispatch(AlertAction.showSuccessAlert('Success', 'Transaction confirmed 👌'));
				}
				setIsLoading(response.isLoading);
				if (response.isError) {
					dispatch(AlertAction.showErrorAlert('Error', `${response?.error}`));
				}
				setTimeout(() => {
					dispatch(AlertAction.hideAlert());
				}, 5000);
			})
			.catch((error) => dispatch(AlertAction.showErrorAlert('Error', `${error || error?.message}`)));
	};
	return (
		<div className='flex flex-col space-y-4'>
			<div className='flex items-center justify-center text-slate-100 space-x-3'>
				<RectangleGroupIcon className='h-6 w-6' />
				<p className='uppercase tracking-widest'>Rexpro</p>
			</div>
			<p className='text-slate-100'>{t('start-a-position')}</p>
			{isConnected && (
				<SolidButton
					type='button'
					primary={true}
					loading={isLoading}
					disabled={isLoading}
					action={isLoading ? `${t('confirming')}...` : t('start-20-position')}
					handleClick={handleStartPosition}
				/>
			)}
			<SolidButton type='button' primary={false} action={`${t('buy')} 100,000 RIC`} handleClick={navigateToUniswap} />
		</div>
	);
};
