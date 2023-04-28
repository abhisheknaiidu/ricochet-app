import Big, { BigSource } from 'big.js';
import { InvestmentFlow } from 'constants/flowConfig';
import { Chain } from 'wagmi';
import { getSFFramework } from './fluidsdkConfig';

interface NetFlowRateResult {
	flowRate: string;
	loading: boolean;
}

export const getNetFlowRate = async (
	usdPrice: Big,
	chain: Chain,
	positions: InvestmentFlow[],
	address: `0x${string}`,
	provider: any
): Promise<NetFlowRateResult> => {
	return new Promise((resolve, reject) => {
		getSFFramework(chain?.id || 137)
			.then(async (framework) => {
				if (positions.length > 0) {
					const flowRates = positions.map(async (position) => {
						const rate = await framework.cfaV1.getNetFlow({
							superToken: position.tokenA,
							account: address,
							providerOrSigner: provider,
						});
						return rate;
					});
					Promise.all(flowRates).then((rates) => {
						const totalRate = rates.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(0);
						if (isNaN(+totalRate)) return reject();
						const flowRateBigNumber = new Big(totalRate);
						const usdFlowRate = flowRateBigNumber
							.times(new Big('2592000'))
							.div(new Big('10e17'))
							.times(usdPrice as BigSource)
							.toFixed(0);
						resolve({ flowRate: usdFlowRate, loading: false });
					});
				} else {
					resolve({ flowRate: '0', loading: false });
				}
			})
			.catch((e) => reject());
	});
};