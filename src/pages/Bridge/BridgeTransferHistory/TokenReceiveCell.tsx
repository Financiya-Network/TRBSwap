import { Info } from 'react-feather'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'

import { MouseoverTooltip } from 'components/Tooltip'
import { MultichainTransfer } from 'hooks/bridge/useGetBridgeTransfers'
import useTheme from 'hooks/useTheme'
import { formatAmountBridge } from 'pages/Bridge/helpers'
import { ExternalLink, MEDIA_WIDTHS } from 'theme'

const formatAmountBridgeForMobile = (rawAmount: string | number) => {
  const amount = parseFloat(String(rawAmount) ?? '0')
  if (amount > 100_000) {
    const formatter = Intl.NumberFormat('en-US', {
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      minimumSignificantDigits: 1,
      maximumSignificantDigits: 5,
    })

    return formatter.format(amount)
  }

  const formatter = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return formatter.format(amount)
}

type Props = {
  transfer: MultichainTransfer
}

const TokenReceiveCell: React.FC<Props> = ({ transfer }) => {
  const theme = useTheme()
  const upToExtraSmall = useMedia(`(max-width: ${MEDIA_WIDTHS.upToExtraSmall}px)`)

  const formatter = upToExtraSmall ? formatAmountBridgeForMobile : formatAmountBridge

  const tooltipText = (
    <Text>
      You have received some anyToken from Multichain. You can exchange your anyToken to {transfer.dstTokenSymbol} at{' '}
      Multichain, when the pool has sufficient liquidity.{' '}
      <ExternalLink href="https://app.multichain.org/#/pool">See here ↗</ExternalLink>
    </Text>
  )
  return (
    <Flex
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        gap: '4px',
        color: transfer.isReceiveAnyToken ? theme.warning : undefined,
      }}
    >
      <span>{formatter(transfer.dstAmount)}</span> <span>{transfer.dstTokenSymbol}</span>{' '}
      {transfer.isReceiveAnyToken && (
        <MouseoverTooltip text={tooltipText} placement="top">
          <Info size={16} />
        </MouseoverTooltip>
      )}
    </Flex>
  )
}

export default TokenReceiveCell
