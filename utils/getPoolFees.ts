import { readContract } from "@wagmi/core";
import { Exchange } from "constants/ABIs/v3streamExchange";

export const notAllowedMarkets = [
  '0x86c2B55bf5d3E9DAC2747389B38D41C6B1F34179', //V2 RIC USDC
  '0x56aCA122d439365B455cECb14B4A39A9d1B54621', //IballuoEthXusdc
  '0xbB5C64B929b1E60c085dcDf88dfe41c6b9dcf65B', //IballuousdcWBTC
  '0xE53dd10d49C8072d68d48c163d9e1A219bd6852D', //usdcxIballuo
]

export const getPoolFees = async (market: any) => {
  if (market.flowKey.includes('IbAlluo')) return;
  try {
    return await readContract({
      address: market.superToken as `0x${string}`,
      abi: Exchange,
      functionName: 'outputPools',
      args: [0],
    })
  } catch (e) {
    console.log('error', e)
    return 
  }
}