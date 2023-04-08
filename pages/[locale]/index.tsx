import { Alert } from '@richochet/components/alert';
import { BalanceDisplay } from '@richochet/components/balance-display';
import { Balances } from '@richochet/components/balances';
import { OutlineButton } from '@richochet/components/button';
import { Card, CardContainer, CardWithBackground, CardWithOutline, SmallCard } from '@richochet/components/cards';
import { Footer } from '@richochet/components/footer';
import { LaunchPad } from '@richochet/components/launchpad';
import { Markets } from '@richochet/components/markets';
import Navigation from '@richochet/components/navigation';
import { Positions } from '@richochet/components/positions';
import { Refer } from '@richochet/components/refer';
import { useCoingeckoPrices } from '@richochet/hooks/useCoingeckoPrices';
import { useIsMounted } from '@richochet/hooks/useIsMounted';
import { buildFlowQuery } from '@richochet/utils/buildFlowQuery';
import calculateStreamedSoFar from '@richochet/utils/calculateStreamedSoFar';
import { getSFFramework } from '@richochet/utils/fluidsdkConfig';
import { getFlowUSDValue } from '@richochet/utils/getFlowUsdValue';
import { getSuperTokenBalances } from '@richochet/utils/getSuperTokenBalances';
import { formatCurrency } from '@richochet/utils/helperFunctions';
import { readContract } from '@wagmi/core';
import Big, { BigSource } from 'big.js';
import { ConnectKitButton } from 'connectkit';
import { streamExchangeABI } from 'constants/ABIs/streamExchange';
import { geckoMapping } from 'constants/coingeckoMapping';
import { combinedFlowConfig,	FlowEnum, FlowTypes, InvestmentFlow, getFlowDirectory } from 'constants/flowConfig';
import {
	twoWayMarketDAIWETHAddress,
	twoWayMarketibAlluoUSDBTCAddress,
	twoWayMarketibAlluoUSDETHAddress,
	twoWayMarketMATICUSDCAddress,
	twoWayMarketWBTCAddress,
	twoWayWETHMarketAddress,
	usdcxibAlluoUSDAddress
} from 'constants/polygon_config';
import { getChainRIC } from 'constants/polygon_config';
import { mumbaiUpgradeTokensList, optimismUpgradeTokensList, upgradeTokensList } from 'constants/upgradeConfig';
import { getStaticPaths, makeStaticProps } from 'lib/getStatic';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import coingeckoApi from 'redux/slices/coingecko.slice';
import superfluidSubgraphApi from 'redux/slices/superfluidSubgraph.slice';
import { Flow } from 'types/flow';
import { useAccount, useProvider, useNetwork } from 'wagmi';
import { getSubgraphUrl } from '@richochet/utils/getSubgraphUrl';
import { polygon } from 'wagmi/chains';

const exchangeContractsAddresses = combinedFlowConfig.map((f) => f.superToken);

export default function Home(): JSX.Element {
	const isMounted = useIsMounted();
	const { t } = useTranslation('home');
	const { address, isConnected } = useAccount();
	const [usdPrice, setUsdPrice] = useState<Big>(new Big(0));
	const [usdFlowRate, setUsdFlowRate] = useState<string>('0');
	const [usdFlowRateLoading, setUsdFlowRateLoading] = useState<boolean>(false);
	const { chain } = useNetwork();
	const provider = useProvider({ chainId: chain?.id || polygon.id });
	const [configs, setConfigs] = useState<InvestmentFlow[]>();
	const {
		data: tokenPrice,
		isLoading: tokenPriceIsLoading,
		isSuccess: tokenPriceIsSuccess,
		isError: tokenPriceIsError,
		error: tokenPriceError,
	} = coingeckoApi.useGetTokenPriceQuery('richochet');
	const {
		data: tokens,
		isSuccess: tokensIsSuccess,
		isError: tokensIsError,
		error: tokensError,
		//@ts-ignore
	} = coingeckoApi.useGetUpgradedTokensListQuery();
	const [queries, setQueries] = useState<
		Map<
			string,
			{
				flowKey: string;
				flowsReceived: number;
				flowsOwned: string;
				totalFlows: number;
				placeholder: string;
				subsidyRate: { perso: number; total: number; endDate: string };
				streamedSoFar?: number;
				receivedSoFar?: number;
			}
		>
	>(new Map());
	const [balanceList, setBalanceList] = useState<Record<string, string>>({});
	const [sortedList, setSortedList] = useState<InvestmentFlow[]>([]);
	const [positions, setPositions] = useState<InvestmentFlow[]>([]);
	const [positionTotal, setPositionTotal] = useState<number>(0);
	const [emissionRateMap, setEmissionRateMap] = useState<Map<string, string>>(new Map());
	const [aggregatedRewards, setAggregatedRewards] = useState<number[]>([0]);
	const [aggregatedRICRewards, setAggregatedRICRewards] = useState<number>(0);
	const [ricRewardLoading, setRicRewardLoading] = useState<boolean>(false);
	const [positionTotalLoading, setPositionTotalLoading] = useState<boolean>(false);
	const [results, setResults] = useState<{ flowsOwned: Flow[]; flowsReceived: Flow[] }[]>([]);
	const coingeckoPrices = useCoingeckoPrices();
	const [queryFlows] = superfluidSubgraphApi.useQueryFlowsMutation();
	const [queryStreams] = superfluidSubgraphApi.useQueryStreamsMutation();
	const [queryReceived] = superfluidSubgraphApi.useQueryReceivedMutation();
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
		setConfigs(getFlowDirectory(chain?.id))
	}, [chain?.id])

	useEffect(() => {
		if (isConnected) getSuperTokenBalances(address!).then((res) => setBalanceList(res));
	}, [address, isConnected, chain?.id]);

	useEffect(() => {
		const results = exchangeContractsAddresses.map(
			async (addr) => await queryFlows({queryAddress: addr, network: getSubgraphUrl(chain?.id! || 137)})
				.then((res: any) => {
					return res?.data?.data?.account
				})
		);
		Promise.all(results).then((res) => setResults(res));
	}, [isMounted, address, isConnected, chain?.id]);

	const getStreams = (streams: any[], streamedSoFarMap: Record<string, number>) => {
		(streams || []).forEach((stream: any) => {
			const streamedSoFar = streamedSoFarMap[`${stream.token.id}-${stream.receiver.id}`] || 0;
			Object.assign(streamedSoFarMap, {
				[`${stream.token.id}-${stream.receiver.id}`]:
					Number(streamedSoFar) +
					Number(
						calculateStreamedSoFar(stream.streamedUntilUpdatedAt, stream.updatedAtTimestamp, stream.currentFlowRate)
					),
			});
		});
	};

	const getReceived = (received: any[], receivedSoFarMap: Record<string, number>) => {
		(received || []).forEach((stream: any) => {
			const receivedSoFar = receivedSoFarMap[`${stream.token.id}-${stream.sender.id}`] || 0;
			Object.assign(receivedSoFarMap, {
				[`${stream.token.id}-${stream.sender.id}`]:
					Number(receivedSoFar) +
					Number(
						calculateStreamedSoFar(stream.streamedUntilUpdatedAt, stream.updatedAtTimestamp, stream.currentFlowRate)
					),
			});
		});
	};

	const getFlows = (streamedSoFarMap: Record<string, number>, receivedSoFarMap: Record<string, number>) => {
		const flows: Map<string, { inflows: Flow[]; outflows: Flow[] }> = new Map();
		exchangeContractsAddresses.forEach((el, i) => {
			if (results.length > 0) {
				if (results[i] !== null) {
					//@ts-ignore
					flows.set(el, results[i]);
				} else {
					flows.set(el, { inflows: [], outflows: [] });
				}
			}
		});
		let flowQueries: Map<
			string,
			{
				flowKey: string;
				flowsReceived: number;
				flowsOwned: string;
				totalFlows: number;
				placeholder: string;
				subsidyRate: { perso: number; total: number; endDate: string };
				streamedSoFar?: number;
				receivedSoFar?: number;
			}
		> = new Map();
		if (flows.size > 0) {
			for (const [key, value] of Object.entries(FlowEnum)) {
				flowQueries.set(value, buildFlowQuery(value, address!, flows, streamedSoFarMap, receivedSoFarMap));
			}
		}
		setQueries(flowQueries);
	};

	const sweepQueryFlows = async () => {
		const streamedSoFarMap: Record<string, number> = {};
		const receivedSoFarMap: Record<string, number> = {};
		if (address) {
			await queryStreams({address, network: getSubgraphUrl(chain?.id!)})
				.then((res: any) => {
					getStreams(res?.data?.data?.streams, streamedSoFarMap)
				});
			await queryReceived({receiver: address, network: getSubgraphUrl(chain?.id!)})
				.then((res: any) => {
					getReceived(res?.data?.data?.streams, receivedSoFarMap)
				});
		}
		getFlows(streamedSoFarMap, receivedSoFarMap);
	};

	const contractAddressAllowed = (address: string) => {
		const eligibleAddresses = [
			twoWayMarketibAlluoUSDETHAddress,
			usdcxibAlluoUSDAddress,
			twoWayMarketibAlluoUSDBTCAddress,
			twoWayWETHMarketAddress,
			twoWayMarketWBTCAddress,
			twoWayMarketDAIWETHAddress,
			twoWayMarketMATICUSDCAddress,
		];
		if (eligibleAddresses.includes(address)) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		if (results.length > 0) sweepQueryFlows();
	}, [results, address, isConnected, chain?.id]);

	useEffect(() => {
		if (isConnected && address && isMounted && configs) {
			const positions = configs.filter(({ flowKey }) => parseFloat(queries.get(flowKey)?.placeholder!) > 0);
			setPositions(positions);
		}
	}, [queries, address, isConnected, isMounted, configs, chain?.id]);

	useEffect(() => {
		if (isConnected && tokensIsError) console.error(tokensError);
		if (isConnected && tokensIsSuccess && upgradeList) {
			setPositionTotalLoading(true);
			const totalInPositions = upgradeList.reduce((total: any, token: any) => {
				const balancess =
					Object.keys(balanceList).length &&
					tokens &&
					Object.keys(geckoMapping).length &&
					(
						parseFloat(balanceList[token.superTokenAddress]) *
						parseFloat((tokens as any)[(geckoMapping as any)[token.coin]].usd)
					).toFixed(6);
					if (isNaN(+balancess))  return total + 0;
				return total + parseFloat(balancess);
			}, 0);
			setPositionTotal(totalInPositions);
			setPositionTotalLoading(false);
		}
	}, [isConnected, address, balanceList, tokens, tokensIsSuccess, chain?.id, upgradeList]);

	useEffect(() => {
		if (coingeckoPrices.size > 0 && queries.size > 0 && configs) {
			let list = configs.filter((each) => each.type === FlowTypes.market);
			let sortList = list.sort((a, b) => {
				const totalVolumeA = parseFloat(getFlowUSDValue(a, queries, coingeckoPrices));
				const totalVolumeB = parseFloat(getFlowUSDValue(b, queries, coingeckoPrices));
				return totalVolumeB - totalVolumeA;
			});
			setSortedList(sortList);
		}
	}, [queries, coingeckoPrices, chain?.id, configs]);

	useEffect(() => {
		if (sortedList.length) {
			setRicRewardLoading(true);
			const rateMap: Map<string, string> = new Map();
			(async () =>
				await Promise.all(
					sortedList.map(async (market) => {
						if (contractAddressAllowed(market.superToken)) {
							await readContract({
								address: market.superToken as `0x${string}`,
								abi: streamExchangeABI,
								functionName: chain?.id === 137 ? 'getOutputPool' : 'outputPools',
								args: chain?.id === 137 ? [3] : [1],
							})
								.then((res: any) => {
									const finRate = ((Number(res.emissionRate) / 1e18) * 2592000).toFixed(4);
									rateMap.set(market.superToken, finRate.toString());
								})
								.catch((error: any) => {
									console.log('error', error);
								});
						}
					})
				).then((res) => setEmissionRateMap(rateMap)))();
		}
	}, [sortedList, chain?.id]);

	useEffect(() => {
		if (sortedList.length && queries.size > 0 && emissionRateMap.size > 0) {
			sortedList.map((market) => {
				const subsidy_rate =
					(+queries.get(market.flowKey)?.placeholder! / +queries.get(market.flowKey)?.flowsOwned!) * 100;
				const received_reward = (+subsidy_rate / 100) * +emissionRateMap.get(market.superToken)!;
				if (received_reward) {
					setAggregatedRewards((aggregatedRewards) => [...aggregatedRewards, received_reward]);
				}
			});
		}
	}, [emissionRateMap, queries, sortedList, chain?.id]);

	useEffect(() => {
		if (aggregatedRewards.length) {
			const aggregated = aggregatedRewards
				.filter((reward, index, self) => self.indexOf(reward) === index)
				.reduce((accumulator, reward) => accumulator + reward, 0);
			setAggregatedRICRewards(aggregated);
			setRicRewardLoading(false);
		}
	}, [aggregatedRewards, chain?.id]);

	useEffect(() => {
		if (isConnected && tokenPrice && tokenPriceIsSuccess) {
			setUsdPrice(new Big(parseFloat(tokenPrice?.richochet?.usd)));
		}
		if (tokenPriceIsError) {
			console.error(tokenPriceError);
		}
	}, [isConnected, address, tokenPrice, tokenPriceIsSuccess, chain?.id]);

	const getNetFlowRate = async () => {
		setUsdFlowRateLoading(true);
		await getSFFramework(chain?.id || 137)
			.then(async (framework) => {
				if (positions.length > 0) {
					const flowRates = positions.map(
						async (position) => {
							await framework.cfaV1.getNetFlow({
								superToken: position.tokenA,
								account: address!,
								providerOrSigner: provider,
							})
						}							
					);
					Promise.all(flowRates).then((rates) => {
						//@ts-ignore
						const totalRate = rates.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(0);
						if (isNaN(+totalRate)) return;
						const flowRateBigNumber = new Big(totalRate);
						const usdFlowRate = flowRateBigNumber
							.times(new Big('2592000'))
							.div(new Big('10e17'))
							.times(usdPrice as BigSource)
							.toFixed(0);
						setUsdFlowRate(usdFlowRate);
						setUsdFlowRateLoading(false);
					});
				}
				setUsdFlowRateLoading(false);
			})
			.catch((e) => setUsdFlowRateLoading(false));
	};
	useEffect(() => {
		if (isConnected && usdPrice && chain?.id && positions) {
			getNetFlowRate();
		}
	}, [isConnected]);

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
											{usdFlowRateLoading && !usdFlowRate && (
												<div className='animate-pulse'>
													<div className='h-4 rounded bg-slate-700'></div>
												</div>
											)}
											{usdFlowRate && !usdFlowRateLoading && (
												<p className='text-slate-100 font-light text-2xl'>
													{formatCurrency(parseFloat(usdFlowRate!))} / {t('month')}
												</p>
											)}
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
												<p className='text-slate-100 font-light text-2xl'>
													 0 RIC / mo
												</p>
											)}
											{(aggregatedRICRewards || aggregatedRICRewards === 0) && !ricRewardLoading && (
												<p className='text-slate-100 font-light text-2xl'>
													{aggregatedRICRewards.toFixed(2)} RIC / mo
												</p>
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
									content={sortedList && <Markets coingeckoPrices={coingeckoPrices} sortedList={sortedList} queries={queries} />}
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

