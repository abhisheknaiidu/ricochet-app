import { useCoingeckoPrices } from '@richochet/hooks/useCoingeckoPrices';
import { fetchBalance } from '@wagmi/core';
import { Coin } from 'constants/coins';
import { upgradeTokensList, mumbaiUpgradeTokensList, optimismUpgradeTokensList } from 'constants/upgradeConfig';
import { colors } from 'enumerations/colors.enum';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { OutlineButton, SolidButton } from '../button';
import { DoughnutChart } from '../graphs';
import { DataTable } from '../table';
import { BalanceTabs } from './balance-tabs';

interface Props {
	tokens: any;
	balances: Record<string, string>;
}

export interface TokenData {
	token: string;
	walletAmount: string;
	walletUsdAmount: string;
	ricAmount: string;
	ricUsdAmount: string;
	color: string;
}

const headerTitles = ['token', 'ricochet-balance', 'wallet-balance'];

export const Balances: NextPage<Props> = ({ tokens, balances }): JSX.Element => {
	const { t } = useTranslation('home');
	const { address, isConnected } = useAccount();
	const { chain } = useNetwork()
	const [action, setAction] = useState(0);
	const [tabsClosed, setTabsClosed] = useState(true);
	const coingeckoPrices = useCoingeckoPrices();
	const [sortedUpgradeTokensList, setSortedUpgradeTokensList] = useState<any>();
	const [geckoPriceList, setGeckoPriceList] = useState<Object>({});
	const [tokenList, setTokenList] = useState<TokenData[]>([]);

	useEffect(() => {
		setSortedUpgradeTokensList([])
		if (!chain) return;
		if (chain?.id === 80001) {
			setSortedUpgradeTokensList(mumbaiUpgradeTokensList);
		}
		if (chain?.id === 137) {
			setSortedUpgradeTokensList(upgradeTokensList);
		}
		if (chain?.id === 10) {
			setSortedUpgradeTokensList(optimismUpgradeTokensList);
		}
	}, [chain?.id, balances])

	useEffect(() => {
		if (isConnected && chain?.id) {
			if (tokens) setGeckoPriceList(tokens);
			(async () => {
				if (Object.keys(geckoPriceList).length && Object.keys(balances).length) {
					await Promise.all(
						sortedUpgradeTokensList.map(async (token: any) => {
							if (!address) return;
							const balance = await fetchBalance({
								address: address,
								chainId: chain.id,
								token: token.coin !== Coin.RIC && token.coin !== Coin.OpRIC ? (token.tokenAddress as `0x${string}`) : undefined,
							});
							return {
								token: token.coin,
								ricAmount: balances[token.superTokenAddress],
								ricUsdAmount: (
									parseFloat(balances[token.superTokenAddress]) * coingeckoPrices.get(token.superTokenAddress)!
								).toFixed(2),
								walletAmount: token.coin === Coin.RIC ? 'N/A' : balance?.formatted,
								walletUsdAmount:
									token.coin === Coin.RIC
										? 'N/A'
										: (parseFloat(balance?.formatted) * coingeckoPrices.get(token.superTokenAddress)!).toFixed(2),
								color: colors[token.coin],
								// dollarVal: parseFloat((geckoPriceList as any)[geckoMapping[token.coin]].usd),
							};
						})
					).then((tokens) => {
						// sort array by ric balance in descending order
						const sortedTokens = tokens.sort((a, b) => parseFloat(b.ricAmount) - parseFloat(a.ricAmount));
						if (sortedTokens.length > 0) {
							setTokenList(sortedTokens)
						};
					});
				}
			})();
		}
	}, [isConnected, tokens, balances, geckoPriceList, sortedUpgradeTokensList]);

	return (
		<>
			<p className='font-light uppercase tracking-widest text-primary-500'>{t('your-balances')}</p>
			{!tabsClosed && balances && (
				<BalanceTabs close={tabsClosed} setClose={setTabsClosed} action={action} balanceList={balances} />
			)}
			{tabsClosed && (
				<>
					<div className='flex flex-wrap items-center justify-evenly basis-1/3 my-4'>
						<OutlineButton
							type='button'
							action={`${t('withdraw')}`}
							handleClick={() => {
								setTabsClosed(false);
								setAction(0);
							}}
						/>
						<SolidButton
							type='button'
							action={`${t('deposit')}`}
							primary={true}
							handleClick={() => {
								setTabsClosed(false);
								setAction(1);
							}}
						/>
						{/* <OutlineButton
							type='button'
							action={`${t('swap')}`}
							handleClick={() => {
								setTabsClosed(false);
								setAction(2);
							}}
						/> */}
					</div>
					<div className='flex justify-center my-4'>
						<DoughnutChart tokens={tokenList} geckoPriceList={geckoPriceList} balances={balances} />
					</div>
					{ tokenList && <DataTable headers={headerTitles} rowData={tokenList} tableLoaderRows={6} />}
				</>
			)}
		</>
	);
};
