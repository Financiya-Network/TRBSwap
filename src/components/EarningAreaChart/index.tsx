import { t } from '@lingui/macro'
import { Flex } from 'rebass'
import { Area, AreaChart, Legend as RechartsLegend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import useTheme from 'hooks/useTheme'
import { EarningStatsAtTime } from 'types/myEarnings'

import Legend from './Legend'
import TooltipContent from './TooltipContent'

type Props = {
  data: EarningStatsAtTime[]
}

type KeyOfDataEntry = keyof Pick<EarningStatsAtTime, 'pool' | 'farm'>

type DisplayConfig = Record<
  KeyOfDataEntry,
  {
    legend: string
    color: string
  }
>

export const displayConfig: DisplayConfig = {
  pool: {
    legend: t`Pool Rewards`,
    color: '#3498db',
  },
  farm: {
    legend: t`Farm Rewards`,
    color: '#1abc7c',
  },
}

const renderLegend = () => {
  return (
    <Flex
      width="100%"
      justifyContent="center"
      sx={{
        gap: '16px',
      }}
    >
      <Legend color={displayConfig['farm'].color} label={displayConfig['farm'].legend} />
      <Legend color={displayConfig['pool'].color} label={displayConfig['pool'].legend} />
    </Flex>
  )
}

type TooltipProps = {
  payload: Array<{
    payload: EarningStatsAtTime
  }>
}
const renderTooltip = (props: any) => {
  const payload = (props as TooltipProps).payload
  const dataEntry = payload[0]?.payload // they are all the same

  if (!dataEntry) {
    return null
  }

  return <TooltipContent dataEntry={dataEntry} />
}

const EarningAreaChart: React.FC<Props> = ({ data }) => {
  const theme = useTheme()

  return (
    <ResponsiveContainer>
      <AreaChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.primary} stopOpacity={0.4} />
            <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" fontSize="12px" axisLine={false} tickLine={false} stroke={theme.subText} />
        <YAxis fontSize="12px" axisLine={false} tickLine={false} stroke={theme.subText} />
        <Tooltip content={renderTooltip} cursor={true} />
        <RechartsLegend content={renderLegend} />
        <Area type="monotone" dataKey="farm.totalValue" stroke={theme.primary} fill="url(#colorUv)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default EarningAreaChart
