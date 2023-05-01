import { Listbox, Transition } from '@headlessui/react';
import { ArrowLongRightIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import AlertAction from '@richochet/utils/alertAction';
import { getCoingeckoPairs } from '@richochet/utils/getCoingeckoPairs';
import { getShareScaler } from '@richochet/utils/getShareScaler';
import Big from 'big.js';
import { Coin } from 'constants/coins';
import { FlowTypes, InvestmentFlow, getFlowDirectory } from 'constants/flowConfig';
import { AlertContext } from 'contexts/AlertContext';
import { ExchangeKeys } from 'enumerations/exchangeKeys.enum';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { Fragment, useContext, useEffect, useState } from 'react';
import streamApi from 'redux/slices/streams.slice';
import { RoundedButton } from '../button';
import { AreaGraph } from '../graphs';
import TokenList from '../token-list';
import { useNetwork } from 'wagmi';

interface Props {
	close: boolean;
	setClose: Function;
}

export const NewPosition: NextPage<Props> = ({ close, setClose }) => {
	const postionTypes = ['continuous'];
	const { t } = useTranslation('home');
	const { chain } = useNetwork();
	const [configs] = useState<InvestmentFlow[]>(getFlowDirectory(chain?.id || 137));

	const [coinsFrom, SetCoinsFrom] = useState<Coin[]>(
		configs.map((flow) => flow.coinA).filter((coin, index, self) => self.indexOf(coin) === index)
	);
	const [coinsTo, SetCoinsTo] = useState<Coin[]>(
		configs.map((flow) => flow.coinB).filter((coin, index, self) => self.indexOf(coin) === index)
	);

	const [position, setPosition] = useState<InvestmentFlow>();
	const [coingeckoPairs, setCoingeckoPairs] = useState<Map<string, Coin[]>>(new Map());
	const [from, setFrom] = useState<Coin>(Coin.SELECT);
	const [to, setTo] = useState<Coin>(Coin.SELECT);
	const [amount, setAmount] = useState<string>('0');
	const [state, dispatch] = useContext(AlertContext);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [shareScaler, setShareScaler] = useState(1e3);
	const [startStreamTrigger] = streamApi.useLazyStartStreamQuery();
	const [positionType, setPositionType] = useState(postionTypes[0]);

	useEffect(() => {
		if (!position) return;
		// let exchangeKey = null;
		// if (chain?.id === 137) {
		const exchangeKey = position?.flowKey.includes('FlowQuery')
			? (position?.flowKey?.replace('FlowQuery', '') as ExchangeKeys)
			: Object(ExchangeKeys)[position?.flowKey];
		// } else if (chain?.id === 10) {
		// 	exchangeKey = Object(OPExchangeKeys)[position?.flowKey];
		// }
		const fetchShareScaler = async (exchangeKey: ExchangeKeys, tokenA: string, tokenB: string, chain: number) => {
			const shareScaler = await getShareScaler(exchangeKey, tokenA, tokenB, chain).then((res) => res);
			setShareScaler(shareScaler);
		};
		fetchShareScaler(exchangeKey, position?.tokenA, position?.tokenB, chain?.id || 137);
	}, [position?.flowKey, position?.tokenA, position?.tokenB]);

	useEffect(() => {
		if (from !== Coin.SELECT) {
			const flows = configs
				.filter((flow) => flow.coinA === from)
				.map((flow) => flow.coinB)
				.filter((coin, index, self) => self.indexOf(coin) === index);
			SetCoinsTo([Coin.SELECT, ...flows]);
		} else {
			const flows = configs.map((flow) => flow.coinB).filter((coin, index, self) => self.indexOf(coin) === index);
			SetCoinsTo([Coin.SELECT, ...flows]);
		}
	}, [from]);

	useEffect(() => {
		if (to !== Coin.SELECT) {
			const flows = configs
				.filter((flow) => flow.coinB === to)
				.map((flow) => flow.coinA)
				.filter((coin, index, self) => self.indexOf(coin) === index);
			SetCoinsFrom([Coin.SELECT, ...flows]);
		} else {
			const flows = configs.map((flow) => flow.coinB).filter((coin, index, self) => self.indexOf(coin) === index);
			SetCoinsFrom([Coin.SELECT, ...flows]);
		}
	}, [to]);

	useEffect(() => {
		if (from !== Coin.SELECT && to !== Coin.SELECT) {
			const config = configs.find((flow) => flow.coinA === from && flow.coinB === to);
			setPosition(config);
		}
	}, [from, to]);

	useEffect(() => {
		if (position) {
			console.log(position)
			const pairs = getCoingeckoPairs([position]);
			setCoingeckoPairs(pairs);
		}
	}, [position]);

	const handleSubmit = (event: any) => {
		event.preventDefault();
		if (from === Coin.SELECT || to === Coin.SELECT) return;
		if (!position || !shareScaler) {
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
		const stream = startStreamTrigger({ amount: newAmount, config: position });
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
	};

	return (
		<>
			<p className='text-primary-500 uppercase'>{t('your-streams')}</p>
			<div className='flex flex-wrap items-center justify-between space-y-8 lg:space-y-0 mt-4'>
				<form
					id='new-position-form'
					className='flex flex-col items-start lg:p-8 w-full lg:w-1/2 space-y-6'
					onSubmit={handleSubmit}>
					<label className='text-slate-100'>{t('position-token')}?</label>
					<div className='flex flex-wrap lg:flex-nowrap items-center lg:space-x-4 w-full lg:w-auto'>
						<TokenList classNames='relative w-full z-20' value={from} coins={coinsFrom} handleChange={setFrom} />
						<ArrowLongRightIcon className='h-10 w-16' />
						<TokenList classNames='relative w-full z-20' value={to} coins={coinsTo} handleChange={setTo} />
					</div>
					<label className='text-slate-100'>{t('position-amount')}?</label>
					<input
						type='number'
						step='any'
						className='input-outline'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder={`${t('amount')}`}
					/>
					<label className='text-slate-100'>{t('position-select')}:</label>
					<Listbox value={positionType} onChange={setPositionType}>
						<div className='relative w-full z-10'>
							<Listbox.Button className='relative w-full cursor-default rounded-lg bg-slate-700 py-2 pl-3 pr-10 text-left text-slate-200 shadow-md focus:outline-none focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-300 sm:text-sm'>
								<span className='block truncate'>{t(`${positionType.toLocaleLowerCase().replace(/\s/g, '-')}`)}</span>
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
									{postionTypes.map((type, index) => (
										<Listbox.Option
											key={index}
											className={({ active }) =>
												`relative cursor-default select-none py-2 pl-10 pr-4 ${
													active ? 'bg-slate-800 text-slate-200' : 'text-slate-200'
												}`
											}
											value={type}>
											{({ selected }) => (
												<>
													<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
														{t(`${type.toLocaleLowerCase().replace(/\s/g, '-')}`)}
													</span>
													{selected ? (
														<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-green-600'>
															<CheckIcon className='h-5 w-5' aria-hidden='true' />
														</span>
													) : null}

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
				</form>
				<div className='w-full lg:w-1/2'>
					{/*@ts-ignore*/}
					<AreaGraph pairs={coingeckoPairs} />
				</div>
				<div className='flex space-x-4 w-full justify-end'>
					<button type='button' className='text-slate-100 underline' onClick={() => setClose(!close)}>
						{t('cancel')}
					</button>
					<RoundedButton
						type='submit'
						form='new-position-form'
						loading={isLoading}
						disabled={isLoading}
						action={isLoading ? `${t('processing')}...` : `${t('start-new-position')}`}
					/>
				</div>
			</div>
		</>
	);
};
