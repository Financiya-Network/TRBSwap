import { Trans } from '@lingui/macro'
import { darken } from 'polished'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import useTheme from 'hooks/useTheme'
import { EarningStatsAtTime } from 'types/myEarnings'
import { formattedNumLong } from 'utils'

import { formatUSDValue } from './utilts'

const TokensWrapper = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  gap: 8px 4px;
  color: ${({ theme }) => theme.subText};
  font-weight: 500;
`
const StyledLogo = styled.img`
  width: 16px;
  height: auto;
`

const formatTokenAmount = (a: number) => {
  return formattedNumLong(a, false)
}

type TokensProps = {
  tokens: Array<{
    logoUrl: string
    amount: number
  }>
}

const Tokens: React.FC<TokensProps> = ({ tokens }) => {
  return (
    <TokensWrapper>
      {tokens.map((token, i) => {
        return (
          <Flex
            key={i}
            alignItems="center"
            sx={{
              gap: '4px',
            }}
          >
            <Text
              as="span"
              sx={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '14px',
              }}
            >
              {formatTokenAmount(token.amount)}
            </Text>

            <StyledLogo src={token.logoUrl} alt={'token_name'} />
          </Flex>
        )
      })}
    </TokensWrapper>
  )
}

type Props = {
  dataEntry: EarningStatsAtTime
}
const TooltipContent: React.FC<Props> = ({ dataEntry }) => {
  const theme = useTheme()

  return (
    <Flex
      padding="12px"
      width="200px"
      flexDirection="column"
      sx={{
        gap: '8px',
        background: theme.buttonBlack,
        borderRadius: '4px',
        border: `1px solid ${darken(0.2, theme.border)}`,
      }}
    >
      <Text
        as="span"
        sx={{
          fontSize: '10px',
          color: theme.subText,
        }}
      >
        {dataEntry.date}
      </Text>
      <Text
        as="span"
        sx={{
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '16px',
          color: theme.text,
        }}
      >
        <Trans>My Total Earnings</Trans>:{' '}
        <span>{formatUSDValue(dataEntry.pool.totalValue + dataEntry.farm.totalValue)}</span>
      </Text>

      <Text
        as="span"
        sx={{
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '16px',
          color: theme.blue,
        }}
      >
        <Trans>Pool Rewards</Trans>: <span>{formatUSDValue(dataEntry.pool.totalValue)}</span>
      </Text>

      <Text
        as="span"
        sx={{
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '16px',
          color: theme.primary,
        }}
      >
        <Trans>Farm Rewards</Trans>: <span>{formatUSDValue(dataEntry.farm.totalValue)}</span>
      </Text>

      <Flex
        sx={{
          width: '100%',
          height: '0',
          borderBottom: `1px solid ${theme.border}`,
        }}
      />

      <Tokens tokens={dataEntry.farm.tokens} />
    </Flex>
  )
}

export default TooltipContent
