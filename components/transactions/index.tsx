import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import AlertAction from '@richochet/utils/alertAction';
import { checkForApproval } from '@richochet/utils/checkForApproval';
import { getSuperTokenBalances } from '@richochet/utils/getSuperTokenBalances';
import { fetchBalance } from '@wagmi/core';
import { Coin, namesCoin, namesCoinX } from 'constants/coins';
import { downgradeTokensList, optimismDowngradeList, mumbaiDowngradeList } from 'constants/downgradeConfig';
import { upgradeTokensList, optimismUpgradeTokensList, mumbaiUpgradeTokensList } from 'constants/upgradeConfig';
import { AlertContext } from 'contexts/AlertContext';
import { BalanceAction } from 'enumerations/balanceActions.enum';
import { BigNumber, ethers } from 'ethers';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { Fragment, useContext, useEffect, useState } from 'react';
import streamApi from 'redux/slices/streams.slice';
import { useAccount, useNetwork } from 'wagmi';
import { RoundedButton } from '../button';
import TokenList from '../token-list';

const tolerance = ['0.02%', '0.03%', '0.05%'];

interface Props {
	type: BalanceAction;
	close: boolean;
	balanceList: Record<string, string>;
	setClose: Function;
}

const coins = [...namesCoin, ...namesCoinX];

export const Transactions: NextPage<Props> = ({ type, close, setClose, balanceList }) => {
	const { t } = useTranslation('home');
	const { address } = useAccount();
	const { chain } = useNetwork();
	//const [unlimited, setUnlimited] = useState(false);
	const [state, dispatch] = useContext(AlertContext);
	const [hasApprove, setHasApprove] = useState<boolean>(false);
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
			| 'hasMaticApprove'
			| 'hasFDaiApprove'
			| 'hasFUsdcApprove'
			| 'hasOpUsdcApprove'
			| 'hasOpDaiApprove'
			| 'hasOpEthApprove';
	}>();
	const [downgradeConfig, setDowngradeConfig] = useState<{
		coin: Coin;
		tokenAddress: string;
	}>();
	const [selectedToken, setSelectedToken] = useState<Coin>(Coin.SELECT);
	const [swapFrom, setSwapFrom] = useState<Coin>(Coin.SELECT);
	const [swapTo, setSwapTo] = useState<Coin>(Coin.SELECT);
	const [amount, setAmount] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [slippageTolerance, setSlippageTolerance] = useState<string>();
	const [walletBalance, setWalletBalance] = useState<string>('');
	const [upgradeTrigger] = streamApi.useLazyUpgradeQuery();
	const [approveTrigger] = streamApi.useLazyApproveQuery();
	const [downgradeTrigger] = streamApi.useLazyDowngradeQuery();
	const [downgradeTokens, setDowngradeTokens] = useState<Coin[]>();
	const [upgradeTokens, setUpgradeTokens] = useState<Coin[]>();
	const [downgradeTokenList, setDowngradeTokenList] = useState<any[]>();
	const [upgradeTokenList, setUpgradeTokenList] = useState<any[]>();

	//to-do:refactor this
	useEffect(() => {
		if (!chain) return;
		if (chain.id === 137) {
			const downgradeTokenArr = downgradeTokensList.map((coin) => {
				return coin.coin;
			});
			const upgradeTokenArr = upgradeTokensList.map((coin) => {
				return coin.coin;
			});
			setDowngradeTokens(downgradeTokenArr);
			setUpgradeTokens(upgradeTokenArr);
			setUpgradeTokenList(upgradeTokensList);
			setDowngradeTokenList(downgradeTokensList);
		}
		if (chain.id === 80001) {
			const downgradeTokenArr = mumbaiDowngradeList.map((coin) => {
				return coin.coin;
			});
			const upgradeTokenArr = mumbaiUpgradeTokensList.map((coin) => {
				return coin.coin;
			});
			setDowngradeTokens(downgradeTokenArr);
			setUpgradeTokens(upgradeTokenArr);
			setUpgradeTokenList(mumbaiUpgradeTokensList);
			setDowngradeTokenList(mumbaiDowngradeList);
		}
		if (chain.id === 10) {
			const downgradeTokenArr = optimismDowngradeList.map((coin) => {
				return coin.coin;
			});
			const upgradeTokenArr = optimismUpgradeTokensList.map((coin) => {
				return coin.coin;
			});
			setDowngradeTokens(downgradeTokenArr);
			setUpgradeTokens(upgradeTokenArr);
			setUpgradeTokenList(optimismUpgradeTokensList);
			setDowngradeTokenList(optimismDowngradeList);
		}
	}, [chain]);

	useEffect(() => {
		if (type === BalanceAction.Withdraw && selectedToken !== Coin.SELECT) {
			const token = downgradeTokenList?.find((token) => token.coin === selectedToken);
			setDowngradeConfig(token);
		} else if (type === BalanceAction.Deposit && selectedToken !== Coin.SELECT) {
			const upgradeConfig = upgradeTokenList?.find((token) => token.coin === selectedToken);
			checkForApproval(upgradeConfig?.tokenAddress!, upgradeConfig?.superTokenAddress!).then((hasApprove) =>
				setHasApprove(hasApprove)
			);
			setUpgradeConfig(upgradeConfig);
		}
	}, [selectedToken]);

	useEffect(() => {
		if (BalanceAction.Deposit && upgradeConfig) {
			(async () => {
				const balance = await fetchBalance({
					address: address!,
					chainId: chain?.id,
					token: upgradeConfig?.tokenAddress as `0x${string}`,
				}).then((res) => res?.formatted);
				setWalletBalance(balance);
			})();
		}
	}, [upgradeConfig]);

	const handleApprove = () => {
		if (upgradeConfig) {
			setIsLoading(true);
			const approve = approveTrigger({
				tokenAddress: upgradeConfig?.tokenAddress!,
				superTokenAddress: upgradeConfig?.superTokenAddress!,
				//amount: unlimited ? '' : amount,
			});
			approve.then((res) => {
				setIsLoading(false);
				checkForApproval(upgradeConfig?.tokenAddress!, upgradeConfig?.superTokenAddress!).then((hasApprove) =>
					setHasApprove(hasApprove)
				);
			});
		}
	};

	const setMaxValue = () => {
		if (BalanceAction.Withdraw && balanceList) {
			setAmount(balanceList?.[downgradeConfig?.tokenAddress!]);
		}
		if (BalanceAction.Deposit && walletBalance) {
			setAmount(walletBalance);
		}
	};
	const handleSubmit = (event: any) => {
		event?.preventDefault();
		if (selectedToken !== Coin.SELECT) {
			dispatch(AlertAction.showLoadingAlert('Waiting for your transaction to be confirmed...', ''));
			if (type === BalanceAction.Withdraw) {
				getSuperTokenBalances(address!).then((balances) => {
					if (
						Number(amount) <= 0 ||
						(Object.keys(balances).length && Number(balances[downgradeConfig?.tokenAddress!]) === 0)
					) {
						return;
					}
					const bigNumberAmount = ethers.utils.parseEther(amount);
					setIsLoading(true);
					const downgrade = downgradeTrigger({
						value: bigNumberAmount.toString(),
						tokenAddress: downgradeConfig?.tokenAddress!,
					});
					downgrade
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
				});
			} else if (type === BalanceAction.Deposit) {
				getSuperTokenBalances(address!).then((balances) => {
					if (
						Number(amount) < 0 ||
						(Object.keys(balances).length && upgradeConfig && Number(balances[upgradeConfig.tokenAddress]) === 0)
					) {
						return;
					}
					if (hasApprove) {
						const bigNumberAmount = ethers.utils.parseEther(amount);
						setIsLoading(true);
						const upgrade = upgradeTrigger({
							value: bigNumberAmount.toString(),
							tokenAddress: upgradeConfig?.superTokenAddress!,
						});
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
		}
	};
	return (
		<div className='flex flex-col items-start'>
			<form onSubmit={handleSubmit} className='flex flex-col items-start w-full space-y-6'>
				{(type === BalanceAction.Withdraw || type === BalanceAction.Deposit) && downgradeTokens && upgradeTokens && (
					<>
						<label className='text-slate-100'>
							{t('token-action')} {t(type)}?
						</label>
						<TokenList
							value={selectedToken}
							coins={
								type === BalanceAction.Withdraw ? downgradeTokens : type === BalanceAction.Deposit ? upgradeTokens : []
							}
							handleChange={setSelectedToken}
						/>
						{selectedToken !== Coin.SELECT && (
							<p>
								Balance:{' '}
								{BalanceAction.Withdraw && balanceList && downgradeConfig
									? parseFloat(balanceList?.[downgradeConfig?.tokenAddress!]).toFixed(3)
									: BalanceAction.Deposit && walletBalance && upgradeConfig
									? parseFloat(walletBalance).toFixed(3)
									: 0}{' '}
								{selectedToken}
							</p>
						)}
					</>
				)}
				{type === BalanceAction.Swap && (
					<>
						<label className='text-slate-100'>
							{type === BalanceAction.Swap ? t('tokens-action') : t('token-action')} {t(type)}?
						</label>
						<div className='flex items-center space-x-2 w-full'>
							<span className='text-slate-100'>{t('from')}: </span>
							<TokenList classNames='relative w-full z-30' value={swapFrom} coins={coins} handleChange={setSwapFrom} />
						</div>
						<div className='flex items-center space-x-2 w-full'>
							<span className='text-slate-100'>{t('to')}: </span>
							<TokenList classNames='relative w-full z-20' value={swapTo} coins={coins} handleChange={setSwapTo} />
						</div>
					</>
				)}
				<label className='text-slate-100'>
					{t('amount-action')} {t(type)}?
				</label>
				<div className='relative w-full'>
					<input
						type='number'
						className='input-outline'
						value={amount}
						step='any'
						onChange={(e) => setAmount(e.target.value)}
						placeholder={
							type === BalanceAction.Swap
								? `${swapFrom !== Coin.SELECT ? t('amount-in')! : t('amount')} ${
										swapFrom !== Coin.SELECT ? swapFrom : ''
								  }`
								: t('amount')!
						}
					/>
					<button
						type='button'
						className='pr-8 text-primary-500 hover:text-primary-300 hover:font-bold absolute right-2.5 bottom-2.5 font-medium text-sm'
						onClick={setMaxValue}>
						Max
					</button>
				</div>
				{/* {!hasApprove && type === BalanceAction.Deposit && (
						<div style={{display:'flex', alignItems: 'center'}}>
							<label>Unlimited Approval?</label>
							<input type={"checkbox"} onChange={() => {setUnlimited(!unlimited)}} style={{
								marginLeft: '1em'
							}}/>
						</div>
					)} */}
				{type === BalanceAction.Swap && (
					<>
						<label className='text-slate-100'>{t('slippage-tolerance')}:</label>
						<Listbox value={slippageTolerance} onChange={setSlippageTolerance}>
							<div className='relative w-full z-10'>
								<Listbox.Button className='relative w-full cursor-default rounded-lg bg-slate-700 py-2 pl-3 pr-10 text-left text-slate-200 shadow-md focus:outline-none focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-300 sm:text-sm'>
									<span className='block truncate'>
										{slippageTolerance ? slippageTolerance : 'Select slippage tolerance'}
									</span>
									<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
										<ChevronUpDownIcon className='h-5 w-5 text-slate-100' aria-hidden='true' />
									</span>
								</Listbox.Button>
								<Transition
									as={Fragment}
									leave='transition ease-in duration-100'
									leaveFrom='opacity-100'
									leaveTo='opacity-0'>
									<Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
										{tolerance.map((tol, index) => (
											<Listbox.Option
												key={index}
												className={({ active }) =>
													`relative cursor-default select-none py-2 pl-10 pr-4 ${
														active ? 'bg-slate-800 text-slate-200' : 'text-slate-200'
													}`
												}
												value={tol}>
												{({ selected }) => (
													<>
														<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{tol}</span>
														{selected ? (
															<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-green-600'>
																<CheckIcon className='h-5 w-5' aria-hidden='true' />
															</span>
														) : null}
													</>
												)}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Transition>
							</div>
						</Listbox>
						<p className='text-slate-100'>
							{t('min-output-amt')}: ...{swapTo !== Coin.SELECT ? swapTo : ''}
						</p>
					</>
				)}
				<div className='flex space-x-4 w-full justify-end'>
					<button type='button' className='text-slate-100 underline' onClick={() => setClose(!close)}>
						{t('cancel')}
					</button>
					{(type === BalanceAction.Withdraw || type === BalanceAction.Swap) && (
						<RoundedButton
							type='submit'
							loading={isLoading}
							disabled={isLoading}
							action={isLoading ? `${t('confirming')}...` : `${t('confirm')} ${t(type)}`}
						/>
					)}
					{hasApprove && type === BalanceAction.Deposit && (
						<RoundedButton
							type='submit'
							loading={isLoading}
							disabled={isLoading}
							action={isLoading ? `${t('confirming')}...` : `${t('confirm')} ${t(type)}`}
						/>
					)}
					{!hasApprove && type === BalanceAction.Deposit && (
						<RoundedButton
							type='button'
							loading={isLoading}
							action={isLoading ? `${t('approving')}...` : `${t('approve')}`}
							disabled={selectedToken === Coin.SELECT || isLoading}
							handleClick={handleApprove}
						/>
					)}
				</div>
			</form>
		</div>
	);
};
