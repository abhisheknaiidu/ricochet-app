import { Framework } from '@superfluid-finance/sdk-core';
import { getProvider } from '@wagmi/core';
import { polygon } from 'wagmi/chains';

export const getSFFramework = async (chain: number) => {
	const provider = getProvider({ chainId: chain });
	return await Framework.create({
		provider: provider,
		chainId: chain,
	});
};
