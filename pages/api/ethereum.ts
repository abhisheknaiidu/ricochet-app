import { Signer } from '@ethersproject/abstract-signer';
import { TransactionReceipt } from '@ethersproject/providers';
import { getSFFramework } from '@richochet/utils/fluidsdkConfig';
import { Framework } from '@superfluid-finance/sdk-core';
import Operation from '@superfluid-finance/sdk-core/dist/main/Operation';
import { fetchSigner, getAccount, getProvider, prepareWriteContract, readContract, writeContract, getNetwork } from '@wagmi/core';
import { erc20ABI } from 'constants/ABIs/ERC20';
import { superTokenABI } from 'constants/ABIs/supertoken';
import { indexIDA, optimismLaunchpads } from 'constants/flowConfig';
import {
	MATICxAddress,
	rexLPETHAddress,
	RICAddress,
	ricRexHatLaunchpadAddress,
	ricRexShirtLaunchpadAddress,
	usdcxRicExchangeAddress
} from 'constants/polygon_config';
import { optimismLaunchpad } from 'constants/optimism_config';
import { BigNumber, ethers } from 'ethers';
import { gas } from './gasEstimator';
import { mumbaiLaunchpad } from 'constants/mumbai_config';

export const downgrade = async (contract: any, amount: BigNumber, address: string) => {
	const config = await prepareWriteContract({
		address: contract?.address as `0x${string}`,
		abi: superTokenABI,
		functionName: 'downgrade',
		args: [amount],
		overrides: {
			...(await gas()),
		},
	});
	const data = await writeContract(config);
	return data;
};

export const downgradeMatic = async (contract: any, amount: BigNumber, address: string) => {
	const config = await prepareWriteContract({
		address: contract?.address as `0x${string}`,
		abi: superTokenABI,
		functionName: 'downgradeToETH',
		args: [amount],
		overrides: {
			...(await gas()),
		},
	});
	const data = await writeContract(config);
	return data;
};

export const allowance = async (contract: any, address: string, superTokenAddress: string) => {
	const allowance: any = await readContract({
		address: contract?.address as `0x${string}`,
		abi: erc20ABI,
		functionName: 'allowance',
		args: [address.toLowerCase(), superTokenAddress],
	});
	return allowance;
};

export const approve = async (contract: any, address: string, tokenAddress: string, amount: BigNumber) => {
	const config = await prepareWriteContract({
		address: contract?.address as `0x${string}`,
		abi: superTokenABI,
		functionName: 'approve',
		args: [tokenAddress, amount],
		overrides: {
			...(await gas()),
		},
	});
	const data = await writeContract(config);
	return data;
};

export const upgrade = async (contract: any, amount: BigNumber, address: string) => {
	const config = await prepareWriteContract({
		address: contract?.address as `0x${string}`,
		abi: superTokenABI,
		functionName: 'upgrade',
		args: [amount],
		overrides: {
			...(await gas()),
		},
	});
	const data = await writeContract(config);
	return data;
};

export const upgradeMatic = async (contract: any, amount: BigNumber, address: string) => {
	const config = await prepareWriteContract({
		address: contract?.address as `0x${string}`,
		abi: superTokenABI,
		functionName: 'upgradeByETH',
		overrides: {
			...(await gas()),
		},
	});
	const data = await writeContract(config);
	return data;
};

export const stopFlow = async (exchangeAddress: string, inputTokenAddress: string) => {
	try {
		const { address } = await getAccount();
		const { chain } = await getNetwork();
		const provider = await getProvider({ chainId: chain?.id! });
		const framework = await getSFFramework(chain?.id!);
		const signer = await fetchSigner({
			chainId: chain?.id!,
		});
		const transactionData = {
			superToken: inputTokenAddress,
			sender: address!,
			receiver: exchangeAddress,
			overrides: {
				...(await gas()),
			},
		};
		const tx = await framework.cfaV1.deleteFlow(transactionData).exec(signer as Signer);
		return tx;
	} catch (e: any) {
		console.error(e);
		throw new Error(e);
	}
};

const executeBatchOperations = async (
	operations: Operation[],
	framework: Framework,
	signer: Signer
): Promise<TransactionReceipt> => {
	const txnResponse = await framework.batchCall(operations).exec(signer);
	return txnResponse.wait();
};

//to do, fix network stuff
export const startFlow = async (
	idaContract: any,
	exchangeAddress: string,
	inputTokenAddress: string,
	outputTokenAddress: string,
	amount: BigNumber,
	referralId?: string,
) => {
	try {
		const { address } = await getAccount();
		const { chain } = await getNetwork();
		const framework = await getSFFramework(chain?.id!);
		const config = indexIDA.find(
			(data: any) =>
				data.input === inputTokenAddress &&
				data.output === outputTokenAddress &&
				data.exchangeAddress === exchangeAddress
		);
		if (!config) {
			throw new Error(
				`No config found for this pair: , ${inputTokenAddress}, ${outputTokenAddress}, ${exchangeAddress}`
			);
		}
		const provider = getProvider({ chainId: chain?.id! });
		const signer = await fetchSigner({ chainId: chain?.id! });
		const web3Subscription = await framework.idaV1.getSubscription({
			superToken: config.output,
			publisher: exchangeAddress,
			indexId: config.outputIndex.toString(),
			subscriber: address!,
			providerOrSigner: provider,
		});
		const userFlow = await framework.cfaV1.getFlow({
			superToken: inputTokenAddress,
			sender: address!,
			receiver: exchangeAddress,
			providerOrSigner: provider,
		});
		if (web3Subscription.approved && exchangeAddress !== usdcxRicExchangeAddress) {
			try {
				const transactionData = {
					superToken: inputTokenAddress,
					sender: address!,
					receiver: exchangeAddress,
					flowRate: amount.toString(),
					overrides: {
						...(await gas()),
					},
				};
				const tx =
					Number(userFlow.flowRate) !== 0
						? await framework.cfaV1.updateFlow(transactionData).exec(signer as Signer)
						: await framework.cfaV1.createFlow(transactionData).exec(signer as Signer);
				return tx;
			} catch (e: any) {
				console.error(e);
				throw new Error(e);
			}
		} else {
			const userData = referralId ? ethers.utils.solidityPack(['string'], [referralId]) : '0x';
			if (
				exchangeAddress === usdcxRicExchangeAddress ||
				exchangeAddress === ricRexShirtLaunchpadAddress ||
				exchangeAddress === ricRexHatLaunchpadAddress ||
				exchangeAddress === optimismLaunchpad ||
				exchangeAddress === mumbaiLaunchpad
			) {
				try {
					const operations = [
						/* 		await framework.idaV1.approveSubscription({
							superToken: outputTokenAddress,
							indexId: '0',
							publisher: exchangeAddress,
							userData,
							overrides: {
								...(await gas()),
							}
						}), */
						await framework.cfaV1.createFlow({
							superToken: inputTokenAddress,
							sender: address!,
							receiver: exchangeAddress,
							flowRate: amount.toString(),
							userData,
							overrides: {
								...(await gas()),
							},
						}),
					];
					await executeBatchOperations(operations, framework, signer as Signer);
				} catch (e: any) {
					console.error(e);
					throw new Error(e);
				}
			} else if (outputTokenAddress === rexLPETHAddress) {
				try {
					const operations = [
						await framework.idaV1.approveSubscription({
							superToken: outputTokenAddress,
							indexId: '0',
							publisher: exchangeAddress,
							userData,
							overrides: {
								...(await gas()),
							},
						}),
						await framework.idaV1.approveSubscription({
							superToken: RICAddress,
							indexId: '1',
							publisher: exchangeAddress,
							userData,
							overrides: {
								...(await gas()),
							},
						}),
						/* await framework.idaV1.approveSubscription({
							superToken: WETHxAddress,
							indexId: '2',
							publisher: exchangeAddress,
							userData,
							overrides: {
								maxFeePerGas,
								maxPriorityFeePerGas,
							},
						}), */
						await framework.idaV1.approveSubscription({
							superToken: MATICxAddress,
							indexId: '3',
							publisher: exchangeAddress,
							userData,
							overrides: {
								...(await gas()),
							},
						}),
						await framework.cfaV1.createFlow({
							superToken: inputTokenAddress,
							sender: address!,
							receiver: exchangeAddress,
							flowRate: amount.toString(),
							userData,
							overrides: {
								...(await gas()),
							},
						}),
					];
					await executeBatchOperations(operations, framework, signer as Signer);
				} catch (e: any) {
					console.error(e);
					throw new Error(e);
				}
				//to do remove the ! and figure out if the mumbai contracts have a subsidy
			} else if (config.subsidy) {
				try {
					const operations = [
						await framework.idaV1.approveSubscription({
							superToken: config.output,
							indexId: config.outputIndex.toString(),
							publisher: exchangeAddress,
							userData,
							overrides: {
								gasLimit: 10000000,
							},
						}),
						await framework.idaV1.approveSubscription({
							superToken: config.subsidy,
							indexId: config.subsidyIndex?.toString() || '0',
							publisher: exchangeAddress,
							userData,
							overrides: {
								gasLimit: 10000000,
							},
						}),
						await framework.cfaV1.createFlow({
							superToken: config.input,
							sender: address!,
							receiver: exchangeAddress,
							flowRate: amount.toString(),
							userData,
							overrides: {
								gasLimit: 10000000,
							},
						}),
					];
						await executeBatchOperations(operations, framework, signer as Signer);
				} catch (e: any) {
					console.error(e);
					throw new Error(e);
				}
			} else {
				try {
					const operations = [
						await framework.idaV1.approveSubscription({
							superToken: config.output,
							indexId: config.outputIndex.toString(),
							publisher: exchangeAddress,
							userData,
						}),
						await framework.cfaV1.createFlow({
							superToken: config.input,
							sender: address!,
							receiver: exchangeAddress,
							flowRate: amount.toString(),
							userData,
						}),
					];
					await executeBatchOperations(operations, framework, signer as Signer);
				} catch (e: any) {
					console.error(e, 'here');
					throw new Error(e);
				}
			}
		}
	} catch (e: any) {
		console.error(e);
		throw new Error(e);
	}
};

// TODO Hookup type coinOptions
export const registerToken = async (options: any) => {
	const tokenAdded = await (window as any).ethereum.request({
		method: 'wallet_watchAsset',
		params: {
			type: 'ERC20',
			options,
		},
	});

	return tokenAdded;
};

export const approveToken = async (accountAddress: string, bankAddress: string, tokenContract: any, wad?: any) => {
	const mainWad = wad || ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255));
	const approveRes = await tokenContract.methods
		.approve(bankAddress, mainWad)
		.send({
			from: accountAddress,
			overrides: {
				gasLimit: 10000000,
			},
		})
		.once('transactionHash', (txHash: string) => {
			console.log(txHash);
		})
		.then((resp: string) => resp);

	return approveRes;
};
