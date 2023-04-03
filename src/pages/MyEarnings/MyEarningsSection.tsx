import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Flex } from 'rebass'
import { TokenEarning, useGetEarningDataQuery } from 'services/earning'

import MyEarningsZoomOutModal from 'components/MyEarningsZoomOutModal'
import { useActiveWeb3React } from 'hooks'
import { useAllTokens } from 'hooks/Tokens'
import { useAppSelector } from 'state/hooks'
import { EarningStatsOverTime, EarningStatsTick, EarningsBreakdown } from 'types/myEarnings'
import { isAddress } from 'utils'

import EarningsBreakdownPanel from './EarningsBreakdownPanel'
import MyEarningsOverTimePanel from './MyEarningsOverTimePanel'

const sumTokenEarnings = (earnings: TokenEarning[]) => {
  return earnings.reduce((sum, tokenEarning) => sum + Number(tokenEarning.amountUSD), 0)
}

const MyEarningsSection: React.FC = () => {
  const { chainId, account = '' } = useActiveWeb3React()

  const selectedChainIds = useAppSelector(state => state.myEarnings.selectedChains)
  const getEarningData = useGetEarningDataQuery({ account, chainIds: selectedChainIds })
  const allTokens = useAllTokens()

  const earningBreakdown: EarningsBreakdown | undefined = useMemo(() => {
    const data = getEarningData?.data?.['ethereum']?.account

    const latestData = data?.[0].total
      ?.filter(tokenData => {
        const tokenAddress = isAddress(chainId, tokenData.token)
        if (!tokenAddress) {
          return false
        }

        const currency = allTokens[tokenAddress]
        return !!currency
      })
      .map(tokenData => {
        const tokenAddress = isAddress(chainId, tokenData.token)
        const currency = allTokens[String(tokenAddress)]
        return {
          currency,
          amount: Number(tokenData.amountFloat),
          amountUSD: tokenData.amountUSD,
        }
      })

    if (!latestData) {
      return undefined
    }

    const totalValue = latestData.reduce((sum, { amountUSD }) => {
      return sum + Number(amountUSD)
    }, 0)

    return {
      totalValue,
      breakdowns: latestData.map(tokenData => ({
        title: tokenData.currency.symbol || '',
        value: String(tokenData.amountUSD),
        percent: (Number(tokenData.amountUSD) / totalValue) * 100,
      })),
    }
  }, [allTokens, chainId, getEarningData?.data])

  // chop the data into the right duration
  // format pool value
  const earningStatsOverTime: EarningStatsOverTime | undefined = useMemo(() => {
    const data = getEarningData?.data?.['ethereum']?.account

    const ticks: EarningStatsTick[] = (data || [])
      .slice(0, 30)
      .reverse()
      .map(singlePointData => {
        const poolRewardsValueUSD = sumTokenEarnings(singlePointData.fees || [])
        const farmRewardsValueUSD = sumTokenEarnings(singlePointData.rewards || [])

        const tokenEarningByAddress: Record<string, any> = {}
        ;[...(singlePointData.fees || []), ...(singlePointData.rewards || [])].forEach(tokenEarning => {
          if (!tokenEarningByAddress[tokenEarning.token]) {
            tokenEarningByAddress[tokenEarning.token] = {
              logoUrl: '',
              amount: Number(tokenEarning.amountFloat),
              symbol: tokenEarning.token.slice(0, 5),
            }
          } else {
            tokenEarningByAddress[tokenEarning.token].amount += Number(tokenEarning.amountFloat)
          }
        })

        const tick: EarningStatsTick = {
          date: dayjs(singlePointData.day * 86400 * 1000).format('MMM DD'),
          poolRewardsValue: poolRewardsValueUSD,
          farmRewardsValue: farmRewardsValueUSD,
          totalValue: poolRewardsValueUSD + farmRewardsValueUSD,
          tokens: (singlePointData.total || [])
            .map(tokenEarning => ({
              logoUrl: '',
              amount: Number(tokenEarning.amountFloat),
              symbol: tokenEarning.token.slice(0, 5),
            }))
            .sort((tokenEarning1, tokenEarning2) => tokenEarning2.amount - tokenEarning1.amount),
          hasOtherTokens: (singlePointData.total || []).length > 5,
        }

        return tick
      })

    return {
      lastTotalValue: sumTokenEarnings((data || [])[31]?.total || []),
      ticks,
    }
  }, [getEarningData?.data])

  console.log({ earningBreakdown, earningStatsOverTime })

  return (
    <Flex
      sx={{
        gap: '24px',
      }}
    >
      <EarningsBreakdownPanel isLoading={getEarningData.isLoading} data={earningBreakdown} />
      <MyEarningsOverTimePanel isLoading={getEarningData.isLoading} data={earningStatsOverTime} />

      <MyEarningsZoomOutModal isLoading={getEarningData.isLoading} data={earningStatsOverTime} />
    </Flex>
  )
}

export default MyEarningsSection
