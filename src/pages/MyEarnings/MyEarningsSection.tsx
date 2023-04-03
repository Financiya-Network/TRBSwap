import { ChainId } from '@kyberswap/ks-sdk-core'
import { t } from '@lingui/macro'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Flex } from 'rebass'
import { TokenEarning, useGetEarningDataQuery } from 'services/earning'

import MyEarningsZoomOutModal from 'components/MyEarningsZoomOutModal'
import { NETWORKS_INFO, SUPPORTED_NETWORKS_FOR_MY_EARNINGS } from 'constants/networks'
import { useActiveWeb3React } from 'hooks'
import { useAppSelector } from 'state/hooks'
import { EarningStatsOverTime, EarningStatsTick, EarningsBreakdown } from 'types/myEarnings'
import { isAddress } from 'utils'

import EarningsBreakdownPanel from './EarningsBreakdownPanel'
import MyEarningsOverTimePanel from './MyEarningsOverTimePanel'

const sumTokenEarnings = (earnings: TokenEarning[]) => {
  return earnings.reduce((sum, tokenEarning) => sum + Number(tokenEarning.amountUSD), 0)
}

const chainIdByRoute: Record<string, ChainId> = SUPPORTED_NETWORKS_FOR_MY_EARNINGS.map(chainId => ({
  route: NETWORKS_INFO[chainId].aggregatorRoute,
  chainId,
})).reduce((acc, { route, chainId }) => {
  acc[route] = chainId
  return acc
}, {} as Record<string, ChainId>)

// TODO: handle empty data in a specific chain
const MyEarningsSection: React.FC = () => {
  const { account = '' } = useActiveWeb3React()

  const selectedChainIds = useAppSelector(state => state.myEarnings.selectedChains)
  const getEarningData = useGetEarningDataQuery({ account, chainIds: selectedChainIds })
  const tokensByChainId = useAppSelector(state => state.lists.mapWhitelistTokens)

  const earningBreakdown: EarningsBreakdown | undefined = useMemo(() => {
    const dataByChainRoute = getEarningData?.data || {}
    const latestAggregatedData = Object.keys(dataByChainRoute)
      .flatMap(chainRoute => {
        const data = dataByChainRoute[chainRoute].account
        const chainId = chainIdByRoute[chainRoute]
        const latestData = data?.[0].total
          ?.filter(tokenData => {
            const tokenAddress = isAddress(chainId, tokenData.token)
            if (!tokenAddress) {
              return false
            }

            const currency = tokensByChainId[chainId][tokenAddress]
            return !!currency
          })
          .map(tokenData => {
            const tokenAddress = isAddress(chainId, tokenData.token)
            const currency = tokensByChainId[chainId][String(tokenAddress)]
            return {
              address: tokenAddress,
              symbol: currency.symbol || '',
              amountUSD: Number(tokenData.amountUSD),
              chainId,
            }
          })

        return latestData || []
      })
      .sort((data1, data2) => data2.amountUSD - data1.amountUSD)

    const totalValue = latestAggregatedData.reduce((sum, { amountUSD }) => {
      return sum + amountUSD
    }, 0)

    const totalValueOfOthers = latestAggregatedData.slice(9).reduce((acc, data) => acc + data.amountUSD, 0)

    const breakdowns: EarningsBreakdown['breakdowns'] =
      latestAggregatedData.length <= 10
        ? latestAggregatedData.map(data => ({
            title: data.symbol,
            value: String(data.amountUSD),
            percent: (data.amountUSD / totalValue) * 100,
          }))
        : [
            ...latestAggregatedData.slice(0, 9).map(data => ({
              title: data.symbol,
              value: String(data.amountUSD),
              percent: (data.amountUSD / totalValue) * 100,
            })),
            {
              title: t`Others`,
              value: String(totalValueOfOthers),
              percent: (totalValueOfOthers / totalValue) * 100,
            },
          ]

    return {
      totalValue,
      breakdowns,
    }
  }, [getEarningData?.data, tokensByChainId])

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
            // TODO: slice? check more than 5 tokens
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
