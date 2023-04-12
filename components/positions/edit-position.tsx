import AlertAction from '@richochet/utils/alertAction';
import { checkForApproval } from '@richochet/utils/checkForApproval';
import { getShareScaler } from '@richochet/utils/getShareScaler';
import { getSuperTokenBalances } from '@richochet/utils/getSuperTokenBalances';
import { polygon } from '@wagmi/chains';
import { fetchBalance } from '@wagmi/core';
import Big from 'big.js';
import { Coin } from 'constants/coins';
import { FlowTypes, InvestmentFlow } from 'constants/flowConfig';
import { upgradeTokensList } from 'constants/upgradeConfig';
import { AlertContext } from 'contexts/AlertContext';
import { ExchangeKeys } from 'enumerations/exchangeKeys.enum';
import { ethers } from 'ethers';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useState } from 'react';
import streamApi from 'redux/slices/streams.slice';
import { useAccount, useNetwork } from 'wagmi';
import { OutlineButton, RoundedButton } from '../button';
import { PositionData } from './positions';

interface Props {
	setClose: Function;
	position: PositionData;
}

enum Action {
	none = '',
	change = 'change',
	deposit = 'deposit',
}

export const EditPosition: NextPage<Props> = ({ setClose, position }) => {
	const { t } = useTranslation('home');
	const { address } = useAccount();
	const { chain } = useNetwork();
	const [upgradeConfig, setUpgradeConfig] = useState<{
		coin: Coin;
		tokenAddress: string;
		superTokenAddress: string;
		multi: number;
		key:
			| 'hasIbAlluoUSDApprove'
			| 'hasIbAlluoETHApprove'
			| 'hasIbAlluoBTCApprove'
			| 'hasWethApprove'
			| 'hasUsdcApprove'
			| 'hasWbtcApprove'
			| 'hasDaiApprove'
			| 'hasMaticApprove';
	}>();
	const [action, setAction] = useState<Action>(Action.none);
	const [amount, setAmount] = useState('');
	const [depositAmt, setDepositAmt] = useState('');
	const [state, dispatch] = useContext(AlertContext);
	const [startStreamTrigger] = streamApi.useLazyStartStreamQuery();
	const [stopStreamTrigger] = streamApi.useLazyStopStreamQuery();
	const [walletBalance, setWalletBalance] = useState<string>('');
	const [upgradeTrigger] = streamApi.useLazyUpgradeQuery();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasApprove, setHasApprove] = useState<boolean>(false);
	const [shareScaler, setShareScaler] = useState(1e3);

	useEffect(() => {
		if (!position) return;
		const exchangeKey = position?.flowKey?.replace('FlowQuery', '') as ExchangeKeys;
		const fetchShareScaler = async (exchangeKey: ExchangeKeys, tokenA: string, tokenB: string) => {
			const shareScaler = await getShareScaler(exchangeKey, tokenA, tokenB, chain?.id!).then((res) => res);
			setShareScaler(shareScaler);
		};
		fetchShareScaler(exchangeKey, position?.tokenA, position?.tokenB);
	}, [position?.flowKey, position?.tokenA, position?.tokenB]);

	useEffect(() => {
		if (position) {
			const upgradeConfig = upgradeTokensList.find((token) => token.coin === position.coinA);
			checkForApproval(upgradeConfig?.tokenAddress!, upgradeConfig?.superTokenAddress!).then((hasApprove) =>
				setHasApprove(hasApprove)
			);
			setUpgradeConfig(upgradeConfig);
		}
	}, [position]);

	useEffect(() => {
		if (action === Action.deposit && upgradeConfig) {
			(async () => {
				const balance = await fetchBalance({
					address: address!,
					chainId: polygon.id,
					token: upgradeConfig?.tokenAddress as `0x${string}`,
				}).then((res) => res?.formatted);
				setWalletBalance(balance);
			})();
		}
	}, [action, upgradeConfig]);

	const setMaxValue = () => {
		if (action === Action.deposit && walletBalance) {
			setAmount(walletBalance);
		}
	};

	const handleDeposit = (event: any) => {
		event?.preventDefault();
		if (action === Action.deposit) {
			getSuperTokenBalances(address!).then((balances) => {
				if (
					Number(amount) < 0 ||
					(Object.keys(balances).length && upgradeConfig && Number(balances[upgradeConfig.tokenAddress]) === 0)
				) {
					return;
				}
				if (hasApprove) {
					const bigNumberAmount = ethers.BigNumber.from(amount).toString();
					setIsLoading(true);
					const upgrade = upgradeTrigger({ value: bigNumberAmount, tokenAddress: upgradeConfig?.superTokenAddress! });
					upgrade
						.then((response: any) => {
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
						.catch((error: any) => dispatch(AlertAction.showErrorAlert('Error', `${error || error?.message}`)));
				}
			});
		}
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		if (position && action === Action.change) {
			// Need to call hook here to start a new stream.
			setIsLoading(true);
			dispatch(AlertAction.showLoadingAlert('Waiting for your transaction to be confirmed...', ''));
			if (!position || !shareScaler) {
				dispatch(
					AlertAction.showErrorAlert('Oops!', 'We were unable to find the selected position. Please try another one.')
				);
				setTimeout(() => {
					dispatch(AlertAction.hideAlert());
				}, 5000);
				return;
			}
			let newAmount = amount;
			if (position?.type === FlowTypes.market) {
				const valueBig = new Big(amount);
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
			const config: InvestmentFlow = {
				superToken: position.superToken,
				tokenA: position.tokenA,
				tokenB: position.tokenB,
				coinA: position.coinA,
				coinB: position.coinB,
				flowKey: position.flowKey,
				type: position.type,
			};
			const stream = startStreamTrigger({ amount: newAmount, config });
			stream
				.then((response: any) => {
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
		} else {
			dispatch(
				AlertAction.showErrorAlert('Oops!', 'We were unable to find the selected position. Please try another one.')
			);
			setTimeout(() => {
				dispatch(AlertAction.hideAlert());
			}, 5000);
		}
	};
	const handleStop = () => {
		setIsLoading(true);
		dispatch(AlertAction.showLoadingAlert('Waiting for your transaction to be confirmed...', ''));
		const stopStream = stopStreamTrigger(position);
		stopStream
			.then((response) => {
				if (response.isSuccess) {
					dispatch(AlertAction.showSuccessAlert('Success', 'Transaction confirmed 👌'));
				}
				setIsLoading(response.isLoading);
				if (response.isError) {
					console.log('response', response);
					dispatch(AlertAction.showErrorAlert('Error', `${response?.error}`));
				}
				setTimeout(() => {
					dispatch(AlertAction.hideAlert());
				}, 5000);
			})
			.catch((error) => {
				console.log({ error });
				dispatch(AlertAction.showErrorAlert('Error', `${error || error?.message}`));
			});
	};
	return (
		<div className='flex flex-col space-y-4'>
			{!action && (
				<>
					<h6 className='text-slate-100'>{t('position-action')}?</h6>
					<OutlineButton
						action={`${t('change-swap-amount')}`}
						type='button'
						handleClick={() => setAction(Action.change)}
					/>
					<OutlineButton
						action={`${t('deposit')} ${position.coinA}`}
						type='button'
						handleClick={() => setAction(Action.deposit)}
					/>
					<RoundedButton
						action={isLoading ? `${t('stopping')}...` : `${t('stop-position')}`}
						type='button'
						loading={isLoading}
						disabled={isLoading}
						handleClick={handleStop}
					/>
					<hr className='border-slate-500' />
					<div className='flex justify-end'>
						<button type='button' className='outline-none text-slate-100 underline' onClick={() => setClose(false)}>
							{t('cancel')}
						</button>
					</div>
				</>
			)}
			{action === Action.deposit && (
				<form id='change-swap-form' className='flex flex-col space-y-6' onSubmit={handleDeposit}>
					<label className='text-slate-100'>
						{t('amount-action')} {t('deposit')}?
					</label>
					<div className='relative w-full'>
						<input
							type='number'
							step='any'
							className='input-outline'
							value={amount}
							onChange={(e) => setDepositAmt(e.target.value)}
							placeholder={`${t('amount')}`}
						/>
						<button
							type='button'
							className='pr-8 text-primary-500 hover:text-primary-300 hover:font-bold absolute right-2.5 bottom-2.5 font-medium text-sm'
							onClick={setMaxValue}>
							Max
						</button>
					</div>
					{action === Action.deposit && (
						<p>
							Balance: {walletBalance && upgradeConfig ? parseFloat(walletBalance).toFixed(3) : 0} {position.coinA}
						</p>
					)}
					<div className='flex justify-end space-x-4'>
						<button
							type='button'
							className='outline-none text-slate-100 underline'
							onClick={() => setAction(Action.none)}>
							{t('cancel')}
						</button>
						<RoundedButton
							type='submit'
							action={isLoading ? `${t('confirming')}...` : `${t('confirm')} ${t('deposit')}`}
							primary={true}
							loading={isLoading}
							disabled={!amount || isLoading}
						/>
					</div>
				</form>
			)}
			{action === Action.change && (
				<form id='change-swap-form' className='flex flex-col space-y-6' onSubmit={handleSubmit}>
					<label className='text-slate-100'>{t('desired-swap-amount')}?</label>
					<input
						type='number'
						step='any'
						className='input-outline'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder={`${t('swap-amount')}`}
					/>
					<div className='flex justify-end space-x-4'>
						<button
							type='button'
							className='outline-none text-slate-100 underline'
							onClick={() => setAction(Action.none)}>
							{t('cancel')}
						</button>
						<RoundedButton
							type='submit'
							action={isLoading ? `${t('confirming')}...` : `${t('confirm-change')}`}
							primary={true}
							loading={isLoading}
							disabled={!amount || isLoading}
						/>
					</div>
				</form>
			)}
		</div>
	);
};
