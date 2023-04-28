import { Alert } from '@richochet/components/alert';
import { BalanceDisplay } from '@richochet/components/balance-display';
import { Balances } from '@richochet/components/balances';
import { OutlineButton } from '@richochet/components/button';
import { Card, CardContainer, CardWithBackground, CardWithOutline, SmallCard } from '@richochet/components/cards';
import { Footer } from '@richochet/components/footer';
import { LaunchPad } from '@richochet/components/launchpad';
import { Markets } from '@richochet/components/markets';
import Navigation from '@richochet/components/navigation';
import { NetFlowRate } from '@richochet/components/net-flow-rate';
import { Positions } from '@richochet/components/positions';
import { Refer } from '@richochet/components/refer';
import { useCoingeckoPrices } from '@richochet/hooks/useCoingeckoPrices';
import { useGetBalanceList } from '@richochet/hooks/useGetBalanceList';
import { useGetConfigs } from '@richochet/hooks/useGetConfigs';
import { useGetPositionTotal } from '@richochet/hooks/useGetPositionTotal';
import { useGetPositions } from '@richochet/hooks/useGetPositions';
import { useGetResults } from '@richochet/hooks/useGetResults';
import { useGetRicRewards } from '@richochet/hooks/useGetRicReward';
import { useGetSortedList } from '@richochet/hooks/useGetSortedList';
import { useGetUpgradeList } from '@richochet/hooks/useGetUpgradeList';
import { useGetUsdPrice } from '@richochet/hooks/useGetUsdPrice';
import { useIsMounted } from '@richochet/hooks/useIsMounted';
import { useSweepQueryFlows } from '@richochet/hooks/useSweepQueryFlows';
import { formatCurrency } from '@richochet/utils/helperFunctions';
import { ConnectKitButton } from 'connectkit';
import { combinedFlowConfig } from 'constants/flowConfig';
import { getChainRIC } from 'constants/polygon_config';
import { getStaticPaths, makeStaticProps } from 'lib/getStatic';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import coingeckoApi from 'redux/slices/coingecko.slice';
import { useAccount, useNetwork } from 'wagmi';

const exchangeContractsAddresses = combinedFlowConfig.map((f) => f.superToken);

export default function Home(): JSX.Element {
	const isMounted = useIsMounted();
	const { t } = useTranslation('home');
	const { isConnected } = useAccount();
	const { chain } = useNetwork();
	const {
		data: tokens,
		//@ts-ignore
	} = coingeckoApi.useGetUpgradedTokensListQuery();
	const usdPrice = useGetUsdPrice();
	const coingeckoPrices = useCoingeckoPrices();
	const upgradeList = useGetUpgradeList();
	const balanceList = useGetBalanceList();
	const configs = useGetConfigs();
	const results = useGetResults(exchangeContractsAddresses);
	const queries = useSweepQueryFlows(results, exchangeContractsAddresses);
	const positions = useGetPositions(configs, queries);
	const sortedList = useGetSortedList(coingeckoPrices, configs, queries);
	const { aggregatedRICRewards, ricRewardLoading } = useGetRicRewards(sortedList, queries);
	const { positionTotal, positionTotalLoading } = useGetPositionTotal(balanceList, upgradeList);

	if (!isMounted) {
		return <></>;
	}

	return (
		<>
			<Head>
				<title>Ricochet | Streaming Exchange</title>
				<meta name='description' content='Automatic Real-Time Crypto Investing' />
				<link rel='icon' href='/favicon.ico' />
				<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
			</Head>
			<div className='bg-gradient-to-b from-background-700 via-background-800 to-background-900 overflow-clip'>
				<Navigation />
				<main>
					<div className='mx-auto w-screen py-6 px-8 lg:px-16'>
						<Alert />
						{isConnected && (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-stretch place-items-stretch gap-10'>
								<SmallCard
									content={
										<>
											<h6 className='font-light uppercase tracking-widest text-primary-500 mb-2'>
												{t('total-in-positions')}
											</h6>
											{positionTotalLoading && !positionTotal && (
												<div className='animate-pulse'>
													<div className='h-4 rounded bg-slate-700'></div>
												</div>
											)}
											{(positionTotal || positionTotal === 0) && !positionTotalLoading && (
												<p className='text-slate-100 font-light text-2xl'>{formatCurrency(positionTotal)}</p>
											)}
										</>
									}
								/>
								<SmallCard
									content={
										<>
											<h6 className='font-light uppercase tracking-widest text-primary-500 mb-2'>
												{t('net-flow-rate')}
											</h6>
											<NetFlowRate positions={positions} usdPrice={usdPrice} />
										</>
									}
								/>
								<SmallCard
									content={
										<>
											<h6 className='font-light uppercase tracking-widest text-primary-500 mb-2'>{t('ric-balance')}</h6>
											<div className='text-slate-100 font-light text-2xl space-x-1'>
												<BalanceDisplay tokenAddress={getChainRIC(chain?.id || 137)} showSymbol={true} />
											</div>
										</>
									}
								/>
								<SmallCard
									content={
										<>
											<h6 className='font-light uppercase tracking-widest text-primary-500 mb-2'>
												{t('rewards-earned')}
											</h6>
											{ricRewardLoading && !aggregatedRICRewards && (
												<p className='text-slate-100 font-light text-2xl'>0 RIC / mo</p>
											)}
											{(aggregatedRICRewards || aggregatedRICRewards === 0) && !ricRewardLoading && (
												<p className='text-slate-100 font-light text-2xl'>{aggregatedRICRewards.toFixed(2)} RIC / mo</p>
											)}
										</>
									}
								/>
							</div>
						)}
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-10 place-content-stretch mt-16'>
							<div className='lg:col-span-2 space-y-10'>
								<CardContainer
									content={
										isConnected ? (
											<Positions positions={positions} queries={queries} />
										) : (
											<div className='flex flex-col items-center justify-center space-y-4 h-96'>
												<p className='text-primary-500'>{t('connect-for-positions')}.</p>
												<ConnectKitButton.Custom>
													{({ isConnected, show }) => (
														<>
															{!isConnected && (
																<OutlineButton
																	action={`${t('connect-wallet')}`}
																	type='button'
																	handleClick={show}></OutlineButton>
															)}
														</>
													)}
												</ConnectKitButton.Custom>
											</div>
										)
									}
								/>
								<CardContainer
									content={
										sortedList && (
											<Markets coingeckoPrices={coingeckoPrices} sortedList={sortedList} queries={queries} />
										)
									}
								/>
							</div>
							<div className='space-y-10'>
								<CardWithBackground content={<LaunchPad />} />
								<Card
									content={
										isConnected ? (
											<Balances tokens={tokens} balances={balanceList} />
										) : (
											<div className='flex flex-col items-center justify-center space-y-4 h-96'>
												<p className='text-primary-500'>{t('connect-for-balances')}.</p>
												<ConnectKitButton.Custom>
													{({ isConnected, show }) => (
														<>
															{!isConnected && (
																<OutlineButton
																	action={`${t('connect-wallet')}`}
																	type='button'
																	handleClick={show}></OutlineButton>
															)}
														</>
													)}
												</ConnectKitButton.Custom>
											</div>
										)
									}
								/>
								<CardWithOutline content={<Refer />} />
							</div>
						</div>
					</div>
				</main>
				<Footer />
			</div>
		</>
	);
}

const getStaticProps = makeStaticProps(['home', 'footer']);
export { getStaticPaths, getStaticProps };
