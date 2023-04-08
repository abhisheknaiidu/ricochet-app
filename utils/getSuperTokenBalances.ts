import { readContract } from '@wagmi/core';
import { erc20ABI } from 'constants/ABIs/ERC20';
import { unifiedArray } from 'constants/tokenDirectory';
import { USDCAddress, WBTCAddress } from 'constants/polygon_config';
import { fUSDC } from 'constants/mumbai_config';
import { fromWei } from './fromWei';

export const getSuperTokenBalances = (address: string) => {
	const balances: Record<string, string> = {};
	const contractsAddress = unifiedArray;
	const requests = contractsAddress.map(async (tokenAddress) => {
		try {
			const balance = await readContract({
				address: tokenAddress as `0x${string}`,
				abi: erc20ABI,
				functionName: 'balanceOf',
				args: [address],
			});
			return { balance, tokenAddress };
		} catch {
			return;
		}
	});
	return Promise.all(requests).then((res: any) => {
		res.map((r: any) => {
			if (!r) return;
			if (r.tokenAddress === WBTCAddress) {
				balances[r.tokenAddress] = fromWei(r.balance, 8);
			}
			if (r.tokenAddress === USDCAddress || r.tokenAddress === fUSDC) {
				balances[r.tokenAddress] = fromWei(r.balance, 6);
			}
			balances[r.tokenAddress] = fromWei(r.balance, 18);
		});
		return balances;
	});
};
