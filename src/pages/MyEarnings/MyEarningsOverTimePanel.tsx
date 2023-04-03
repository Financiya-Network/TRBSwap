import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { Maximize, Minimize2 } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import EarningAreaChart from 'components/EarningAreaChart'
import Loader from 'components/Loader'
import LoaderWithKyberLogo from 'components/LocalLoader'
import useTheme from 'hooks/useTheme'
import { useToggleMyEarningsZoomOutModal } from 'state/application/hooks'
import { TimePeriod } from 'state/myEarnings/reducer'
import { EarningStatsOverTime } from 'types/myEarnings'

import TimePeriodSelect from './TimePeriodSelect'

const formatValue = (value: number) => {
  const formatter = Intl.NumberFormat('en-US', {
    notation: 'standard',
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return formatter.format(value)
}

const formatPercent = (value: number) => {
  const formatter = Intl.NumberFormat('en-US', {
    notation: 'standard',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return formatter.format(value)
}

const MemoEarningAreaChart = React.memo(EarningAreaChart)

const PercentDiff = styled.div<{ $color?: string }>`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: ${({ theme, $color }) => $color || theme.subText};
`

const Wrapper = styled.div`
  flex: 1;
  align-self: stretch;

  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
`

type Props = {
  isZoomed?: boolean
  className?: string

  isLoading?: boolean
  data?: EarningStatsOverTime
}

const MyEarningsOverTimePanel: React.FC<Props> = ({ className, isZoomed = false, isLoading, data }) => {
  const theme = useTheme()
  const [period, setPeriod] = useState<TimePeriod>('1D')
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const toggleModal = useToggleMyEarningsZoomOutModal()

  const todayValue = data?.ticks.slice(-1)[0]?.totalValue

  const renderPercentDiff = () => {
    if (isLoading || !data) {
      return <PercentDiff>--</PercentDiff>
    }

    const diffValue = Number(hoverValue) - Number(todayValue)
    if (Number.isNaN(diffValue)) {
      return <PercentDiff>--</PercentDiff>
    }

    const diffPercent = ((hoverValue || todayValue || 0) / data.lastTotalValue - 1) * 100

    return (
      <PercentDiff $color={diffValue > 0 ? theme.primary : diffValue < 0 ? theme.red : undefined}>
        {formatValue(diffValue)} ({formatPercent(diffPercent)}%)
      </PercentDiff>
    )
  }

  return (
    <Wrapper className={className}>
      <Flex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Flex
          sx={{
            width: 'fit-content',
            flexDirection: 'column',
          }}
        >
          <Text
            as="span"
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '16px',
              color: theme.subText,
            }}
          >
            <Trans>My Earnings ({period})</Trans>
          </Text>

          <Text
            sx={{
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '24px',
              marginTop: '8px',
              marginBottom: '4px',
            }}
          >
            {isLoading || !data ? <Loader /> : formatValue(hoverValue || todayValue || 0)}
          </Text>

          {renderPercentDiff()}
        </Flex>

        <Flex
          sx={{
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <TimePeriodSelect period={period} setPeriod={setPeriod} />
          <Flex
            onClick={toggleModal}
            sx={{
              cursor: 'pointer',
            }}
          >
            {isZoomed ? <Minimize2 size={22} /> : <Maximize size={22} />}
          </Flex>
        </Flex>
      </Flex>

      {isLoading || !data ? (
        <LoaderWithKyberLogo />
      ) : (
        <MemoEarningAreaChart data={data.ticks} setHoverValue={setHoverValue} />
      )}
    </Wrapper>
  )
}

export default MyEarningsOverTimePanel
