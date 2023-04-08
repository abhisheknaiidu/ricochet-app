import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { startFlow, upgrade } from '@richochet/api/ethereum';
import { transformError } from '@richochet/utils/transformError';
import { getAccount, getContract } from '@wagmi/core';
import { idaABI } from 'constants/ABIs/ida';
import { superTokenABI } from 'constants/ABIs/supertoken';
import { idaAddress, MATICxAddress } from 'constants/polygon_config';
import { ethers } from 'ethers';
import { PositionData } from './../../components/positions/positions';
import { approve, downgrade, downgradeMatic, stopFlow, upgradeMatic } from './../../pages/api/ethereum';

const streamApi = createApi({
	keepUnusedDataFor: 60, // 60 seconds (default)
	reducerPath: 'streams',
	baseQuery: fetchBaseQuery(),
	endpoints: (builder) => ({
		startStream: builder.query<
			{
				amount: string;
				config: {
					[key: string]: string;
				};
			} | null,
			{
				amount: string;
				config: {
					[key: string]: string;
				};
			}
		>({
			//Payload type:
			//config.superToken,
			//config.tokenA,
			//config.tokenB,
			//normalizedAmount,
			//config.referralId

			queryFn: async (payload: any): Promise<any | undefined> => {
				try {
					const { amount, config } = payload;
					// we must initialize a contract address with idaContract: getContract(idaAddress, idaABI, web3);
					const idaContract = await getContract({ address: idaAddress, abi: idaABI });
					// We must normalize the payload amount for superfluid function
					const normalizedAmount = ethers.utils.parseEther(amount);
					//  Math.round((Number(amount) * 1e18) / 2592000);
					// we must call the startFlow function in api/ethereum.ts with following Data
					//
					//idaContract: Initialized Contract Object from line 18 comment,
					//exchangeAddress: string, (part of config) from user input
					//inputTokenAddress: string,  (part of config) from user input
					//outputTokenAddress: string, (part of config) from user input
					//amount: number, // (part of config) from user input
					//web3: Web3,  //Initialized in line 17, WEB3 object
					//referralId?: string, //this comes from state
					const tx = await startFlow(
						idaContract,
						config.superToken,
						config.tokenA,
						config.tokenB,
						normalizedAmount,
						config.referralId,
					);
					return tx?.wait(1).then((res) => {
						return {
							data: res,
						};
					});
				} catch (e) {
					const error = transformError(e);
					return { error };
				}
			},
		}),
		stopStream: builder.query<PositionData | null, PositionData>({
			queryFn: async (payload: any): Promise<any | undefined> => {
				try {
					const { superToken, tokenA } = payload;
					const tx = await stopFlow(superToken, tokenA);
					return tx.wait(1).then((res) => {
						return {
							data: res,
						};
					});
				} catch (e) {
					const error = transformError(e);
					return { error };
				}
			},
		}),
		downgrade: builder.query<{ value: string; tokenAddress: string } | null, { value: string; tokenAddress: string }>({
			queryFn: async (payload: any): Promise<any | undefined> => {
				try {
					const { tokenAddress, value } = payload;
					// Math.round(Number(value) * 10e18).toString();
					const { address } = getAccount();
					const contract = await getContract({ address: tokenAddress, abi: superTokenABI });
					const tx =
						tokenAddress === MATICxAddress
							? await downgradeMatic(contract, value, address!)
							: await downgrade(contract, value, address!);
					return tx.wait(1).then((res) => {
						return {
							data: res,
						};
					});
				} catch (e: any) {
					const error = transformError(e);
					return { error };
				}
			},
		}),
		upgrade: builder.query<{ value: string; tokenAddress: string } | null, { value: string; tokenAddress: string }>({
			queryFn: async (payload: any): Promise<any | undefined> => {
				try {
					const { tokenAddress, value } = payload;
					const { address } = getAccount();
					const contract = await getContract({ address: tokenAddress, abi: superTokenABI });
					const tx =
						tokenAddress === MATICxAddress
							? await upgradeMatic(contract, value, address!)
							: await upgrade(contract, value, address!);
					return tx.wait(1).then((res) => {
						return {
							data: res,
						};
					});
				} catch (e) {
					const error = transformError(e);
					return { error };
				}
			},
		}),
		approve: builder.query<
			{ tokenAddress: string; superTokenAddress: string; } | null,
			{ tokenAddress: string; superTokenAddress: string; }
		>({
			queryFn: async (payload: any): Promise<any | undefined> => {
				try {
					const { tokenAddress, superTokenAddress } = payload;
					const { address } = getAccount();
					// Allow max instead of amount
					const bnAmount = ethers.BigNumber.from('2').pow(ethers.BigNumber.from('256')).sub(ethers.BigNumber.from('1'));
					const contract = await getContract({ address: tokenAddress, abi: superTokenABI });
					const tx = await approve(contract, address!, superTokenAddress, bnAmount);
					return tx.wait(1).then((res) => {
						return {
							data: res,
						};
					});
				} catch (e) {
					const error = transformError(e);
					return { error };
				}
			},
		}),
	}),
});

export default streamApi;
