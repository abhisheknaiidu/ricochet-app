import React, { FC, useEffect, useState } from 'react'
import { CoinChange, DataType } from '../coins/coin-change'
import { formatCurrency } from '@richochet/utils/helperFunctions'
import { MarketData } from '../markets'
import { getPoolFees, notAllowedMarkets } from '@richochet/utils/getPoolFees';
import { ethers } from 'ethers';
import { useNetwork } from 'wagmi';

export const MarketRow: FC<MarketData> = (data: any) => {
  const { chain } = useNetwork();
  const [feePercent, setFeePercent] = useState('');
  const [market, setMarket] = useState<MarketData>();
  useEffect(() => {
    setMarket(data.data)
    const getFee = async () => {
      if (notAllowedMarkets.includes(data.data.superToken) || !chain?.id) {
        setFeePercent('0.5%')
        return;
      } 
      const fee: any = await getPoolFees(data.data, chain?.id)
      setFeePercent(`${+ethers.utils.formatEther(fee?.feeRate || 5000) * 10 ** 18 / 10000}%`);
    }

    getFee()
  }, [data])

  return (

    <>
      {
        market ?
        <>
          <td className='px-2 py-4 whitespace-nowrap'>
            <div className='inline-flex items-center gap-2'>
              <CoinChange coinA={market.coinA} coinB={market.coinB} type={DataType.Market} />
            </div>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>{feePercent}</td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <p>{formatCurrency(parseFloat(market.usdValue))}</p>
            <p className='text-slate-400'>
              {market.total} <span className='text-sm'>{market.coinA}x</span>
            </p>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            {market.streams}
            {/* {t('streams')} */}
          </td>
        </> : 'loading...'
      }
    </>
    
  )
}
