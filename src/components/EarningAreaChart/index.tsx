import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import useTheme from 'hooks/useTheme'
import { EarningStatsTick } from 'types/myEarnings'
import { formattedNum } from 'utils'

import TooltipContent from './TooltipContent'

type Props = {
  setHoverValue: React.Dispatch<React.SetStateAction<number | null>>
  data: EarningStatsTick[]
}
const EarningAreaChart: React.FC<Props> = ({ data, setHoverValue }) => {
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
        onMouseLeave={() => setHoverValue(null)}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.primary} stopOpacity={0.4} />
            <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" fontSize="12px" axisLine={false} tickLine={false} stroke={theme.subText} />
        <YAxis
          fontSize="12px"
          axisLine={false}
          tickLine={false}
          stroke={theme.subText}
          tickFormatter={(value: any, index: number) => String(formattedNum(String(value)))}
        />
        <Tooltip
          content={(props: any) => {
            const payload = props.payload as Array<{
              payload: EarningStatsTick
            }>
            const dataEntry = payload[0]?.payload // they are all the same

            if (!dataEntry) {
              return null
            }

            return <TooltipContent dataEntry={dataEntry} setHoverValue={setHoverValue} />
          }}
          cursor={true}
        />
        <Area type="monotone" dataKey="totalValue" stroke={theme.primary} fill="url(#colorUv)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default EarningAreaChart
