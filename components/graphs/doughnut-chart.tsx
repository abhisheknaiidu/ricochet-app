import { formatCurrency } from '@richochet/utils/helperFunctions';
import { geckoMapping } from 'constants/coingeckoMapping';
import { upgradeTokensList, mumbaiUpgradeTokensList, optimismUpgradeTokensList } from 'constants/upgradeConfig';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { TokenData } from '../balances';
import { useNetwork } from 'wagmi';

interface Props {
	tokens: TokenData[];
	geckoPriceList: any;
	balances: Record<string, string>;
}

interface ChartData {
	name: string;
	color: string;
	value: number;
}

export const DoughnutChart: NextPage<Props> = ({ tokens, geckoPriceList, balances }): JSX.Element => {
	const { t } = useTranslation('home');
	const [total, setTotal] = useState<number>(0);
	const [chartData, setChartData] = useState<ChartData[]>([]);
	const [tokenList, setTokenList] = useState<any>([]);
	const { chain } = useNetwork()

	useEffect(() => {
		if (!chain) return;
		if (chain?.id === 80001) {
			setTokenList(mumbaiUpgradeTokensList);
		}
		if (chain?.id === 137) {
			setTokenList(upgradeTokensList);
		}
		if (chain?.id === 10) {
			setTokenList(optimismUpgradeTokensList);
		}
	}, [chain])

	useEffect(() => {
		const data: ChartData[] = [];
		tokens
			.filter((token) => !!token.color)
			.map((token) => {
				data.push({
					name: token.token,
					color: token.color,
					value: parseFloat(token.ricUsdAmount),
				});
			});
		setChartData(data);
	}, [tokens]);

	useEffect(() => {
		const total = tokenList.reduce((total: any, token: any) => {
			const balanceList =
				Object.keys(balances).length &&
				Object.keys(geckoPriceList).length &&
				Object.keys(geckoMapping).length &&
				(
					parseFloat(balances[token.superTokenAddress]) *
					parseFloat((geckoPriceList as any)[(geckoMapping as any)[token.coin]].usd)
				).toFixed(6);

			return total + parseFloat(balanceList as any);
		}, 0);
		setTotal(total);
	}, [tokens]);

	return (
		<div className='h-52 w-52'>
			<ResponsiveContainer height='100%' width='100%'>
				<PieChart>
					<text fill='#81a8ce' x={100} y={80} textAnchor='middle' dominantBaseline='middle'>
						{t('total')}
					</text>
					{total && (
						<text fill='white' x={100} y={110} fontWeight={600} textAnchor='middle' dominantBaseline='middle'>
							{formatCurrency(total)}
						</text>
					)}
					<Pie
						data={chartData}
						innerRadius={80}
						outerRadius={100}
						fill='#81a8ce'
						paddingAngle={0}
						nameKey='name'
						dataKey='value'>
						{chartData.map((entry, i) => (
							<Cell key={`cell-${i}`} fill={entry.color} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};
