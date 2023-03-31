import { CurrencyAmount, Token } from '@kyberswap/ks-sdk-core'
import { Trans, t } from '@lingui/macro'
import { rgba } from 'polished'
import React, { useCallback, useRef, useState } from 'react'
import { Info, Plus, Share2 } from 'react-feather'
import { Link } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import styled, { css } from 'styled-components'

import bgimg from 'assets/images/card-background-2.png'
import { ReactComponent as DownSvg } from 'assets/svg/down.svg'
import { ButtonLight, ButtonOutlined, TextButtonPrimary } from 'components/Button'
import Column from 'components/Column'
import CopyHelper from 'components/Copy'
import CurrencyLogo from 'components/CurrencyLogo'
import Divider from 'components/Divider'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import AspectRatio from 'components/Icons/AspectRatio'
import Harvest from 'components/Icons/Harvest'
import InfoHelper from 'components/InfoHelper'
import Row, { RowBetween, RowFit } from 'components/Row'
import { MouseoverTooltip } from 'components/Tooltip'
import { useSharePoolContext } from 'components/YieldPools/SharePoolContext'
import { APP_PATHS, ELASTIC_BASE_FEE_UNIT } from 'constants/index'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { useFarmV2Action, useUserFarmV2Info } from 'state/farms/elasticv2/hooks'
import { ElasticFarmV2, ElasticFarmV2Range } from 'state/farms/elasticv2/types'
import { getFormattedTimeFromSecond } from 'utils/formatTime'
import { formatDollarAmount } from 'utils/numbers'

import PriceVisualize from './PriceVisualize'
import StakeWithNFTsModal from './StakeWithNFTsModal'
import UnstakeWithNFTsModal from './UnstakeWithNFTsModal'

const WrapperInner = styled.div<{ hasRewards: boolean }>`
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  background-color: ${({ theme }) => theme.buttonBlack};
  border-radius: 24px;
  font-weight: 500;
  height: 100%;
  &.rotate {
    transform: rotateY(180deg);
  }

  ${({ hasRewards }) =>
    hasRewards &&
    css`
      background-image: ${({ theme }) =>
        `url(${bgimg}),
        linear-gradient(to right, ${rgba(theme.apr, 0.12)}, ${rgba(theme.apr, 0.12)}),
        linear-gradient(to right, ${theme.buttonBlack}, ${theme.buttonBlack})`};
      background-size: cover;
      background-repeat: no-repeat;
    `}
`
const Wrapper = styled.div`
  height: 430px;
  perspective: 1200px;
`

const FrontFace = styled.div`
  padding: 16px;
  backface-visibility: hidden;

  display: flex;
  flex-direction: column;
  gap: 16px;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
`
const BackFace = styled(FrontFace)`
  z-index: 1;
  transform: rotateY(180deg);
`
// const MenuItem = styled(RowFit)`
//   font-size: 12px;
//   line-height: 16px;
//   color: var(--subtext);
//   gap: 4px;
//   cursor: pointer;
//   :hover {
//     color: var(--primary);
//   }
// `

const Ranges = styled(Column)`
  overflow: hidden;
  z-index: 2;
  gap: 16px;
  overflow: hidden;
  transition: all 0.2s linear;
  flex: 1;
`

const RangeItemWrapper = styled(Column)<{ active?: boolean }>`
  gap: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 12px;
  background-color: var(--button-black);
  cursor: pointer;
  transition: all 0.2s ease;

  :hover {
    background-color: var(--button-black-90);
  }

  ${({ active }) =>
    active &&
    css`
      background-color: rgba(49, 203, 158, 0.15);
      border-color: var(--primary);
      :hover {
        background-color: rgba(49, 203, 158, 0.3);
      }
    `}
`

const UnstakeButton = styled(ButtonOutlined)`
  padding: 12px 6px;
  :hover {
    opacity: 0.9;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `}
`

const IconButton = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--subtext);
  :hover {
    color: var(--subtext-120);
  }
`

const FeeBadge = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: var(--blue);
  background-color: rgba(8, 161, 231, 0.2);
  border-radius: 16px;
  padding: 2px 4px;
`

export const RangeItem = ({
  active,
  onRangeClick,
  rangeInfo,
  token0,
  token1,
  farmId,
  addLiquidityLink,
}: {
  active: boolean
  onRangeClick: () => void
  rangeInfo: ElasticFarmV2Range
  token0: Token
  token1: Token
  farmId: number
  addLiquidityLink?: string
}) => {
  const theme = useTheme()
  const stakedPos = useUserFarmV2Info(farmId, rangeInfo.index)
  const myDepositUSD = stakedPos.reduce((total, item) => item.stakedUsdValue + total, 0)

  const canUpdateLiquidity = stakedPos.some(item => item.liquidity.gt(item.stakedLiquidity))
  const myTotalPosUSDValue = stakedPos.reduce((total, item) => item.positionUsdValue + total, 0)
  const notStakedUSD = myTotalPosUSDValue - myDepositUSD

  let amountToken0 = CurrencyAmount.fromRawAmount(token0, 0)
  let amountToken1 = CurrencyAmount.fromRawAmount(token1, 0)

  stakedPos.forEach(item => {
    amountToken0 = amountToken0.add(item.position.amount0)
    amountToken1 = amountToken1.add(item.position.amount1)
  })

  return (
    <RangeItemWrapper active={active} onClick={onRangeClick}>
      <RowBetween>
        <Column gap="4px">
          <Text fontSize="12px" lineHeight="16px" color={theme.subText}>
            <Trans>Avg APR</Trans>
          </Text>
          <Text fontSize="28px" fontWeight="500" color={theme.apr}>
            {rangeInfo.apr ? rangeInfo.apr.toFixed(2) + '%' : '--'}
          </Text>
        </Column>
        <Column gap="4px">
          {addLiquidityLink && (
            <Text
              fontSize="12px"
              lineHeight="16px"
              color={rangeInfo.isRemoved ? theme.warning : theme.primary}
              alignSelf="flex-end"
              sx={{
                borderBottom: rangeInfo.isRemoved ? undefined : `1px dotted ${theme.primary}`,
              }}
            >
              {rangeInfo.isRemoved ? (
                <Trans>Inactive Range</Trans>
              ) : (
                <MouseoverTooltip
                  text={t`Add liquidity to ${token0.symbol} - ${token1.symbol} pool using the current active range`}
                  placement="top"
                >
                  <Link to={addLiquidityLink}>
                    <Trans>Active Range ↗</Trans>
                  </Link>
                </MouseoverTooltip>
              )}
            </Text>
          )}
          <PriceVisualize
            inactive={rangeInfo.isRemoved}
            tickRangeLower={rangeInfo.tickLower}
            tickRangeUpper={rangeInfo.tickUpper}
            tickCurrent={rangeInfo.tickCurrent}
            token0={token0}
            token1={token1}
          />
        </Column>
      </RowBetween>
      <RowBetween>
        <Column gap="4px">
          <Text fontSize="12px" lineHeight="16px" color={theme.subText}>
            <Trans>Staked TVL</Trans>
          </Text>
          <Text fontSize="16px" fontWeight="500" lineHeight="16px" color={theme.text}>
            {rangeInfo.tvl ? formatDollarAmount(rangeInfo.tvl) : '--'}
          </Text>
        </Column>
        <Column gap="4px" style={{ alignItems: 'flex-end' }}>
          <Text fontSize="12px" lineHeight="16px" color={theme.subText}>
            <Trans>My Deposit</Trans>
          </Text>

          <MouseoverTooltip
            placement="bottom"
            width={canUpdateLiquidity ? '270px' : 'fit-content'}
            text={
              !stakedPos.length ? (
                ''
              ) : canUpdateLiquidity ? (
                <Flex
                  sx={{
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '12px',
                    lineHeight: '16px',
                    fontWeight: 400,
                  }}
                >
                  <Text as="span" color={theme.subText}>
                    <Trans>
                      You still have {formatDollarAmount(notStakedUSD)} in liquidity to stake to earn even more farming
                      rewards
                    </Trans>
                  </Text>
                  <Text as="span" color={theme.text}>
                    Staked: {formatDollarAmount(myDepositUSD)}
                  </Text>
                  <Text as="span" color={theme.warning}>
                    Not staked: {formatDollarAmount(notStakedUSD)}
                  </Text>
                </Flex>
              ) : (
                <>
                  <Flex alignItems="center" sx={{ gap: '4px' }}>
                    <CurrencyLogo currency={amountToken0.currency} size="16px" />
                    {amountToken0.toSignificant(6)} {amountToken0.currency.symbol}
                  </Flex>

                  <Flex alignItems="center" sx={{ gap: '4px' }}>
                    <CurrencyLogo currency={amountToken1.currency} size="16px" />
                    {amountToken1.toSignificant(6)} {amountToken1.currency.symbol}
                  </Flex>
                </>
              )
            }
          >
            <Text
              fontSize="16px"
              fontWeight="500"
              alignItems="center"
              display="flex"
              color={canUpdateLiquidity ? theme.warning : theme.text}
            >
              {formatDollarAmount(myTotalPosUSDValue)}
              {canUpdateLiquidity && <Info size={14} style={{ marginLeft: '4px' }} />}
              {!!stakedPos.length && <DownSvg />}
            </Text>
          </MouseoverTooltip>
        </Column>
      </RowBetween>
    </RangeItemWrapper>
  )
}

function FarmCard({ farm, poolAPR, isApproved }: { farm: ElasticFarmV2; poolAPR: number; isApproved: boolean }) {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const [showStake, setShowStake] = useState(false)
  const [showUnstake, setShowUnstake] = useState(false)
  const [activeRangeIndex, setActiveRangeIndex] = useState(0)

  const setSharePoolAddress = useSharePoolContext()

  const wrapperInnerRef = useRef<HTMLDivElement>(null)

  const handleFlip = useCallback(() => {
    wrapperInnerRef.current?.classList.toggle('rotate')
  }, [])

  const currentTimestamp = Math.floor(Date.now() / 1000)
  const stakedPos = useUserFarmV2Info(farm.fId, farm.ranges[activeRangeIndex].index)
  let amountToken0 = CurrencyAmount.fromRawAmount(farm.token0, 0)
  let amountToken1 = CurrencyAmount.fromRawAmount(farm.token1, 0)

  stakedPos.forEach(item => {
    amountToken0 = amountToken0.add(item.position.amount0)
    amountToken1 = amountToken1.add(item.position.amount1)
  })

  const canUnstake = stakedPos.length > 0

  const hasRewards = stakedPos.some(item => item.unclaimedRewards.some(rw => rw.greaterThan('0')))

  const userTotalRewards = farm.totalRewards.map((item, index) => {
    return stakedPos
      .map(item => item.unclaimedRewards[index])
      .reduce((total, cur) => total.add(cur), CurrencyAmount.fromRawAmount(item.currency, 0))
  })

  const myDepositUSD = stakedPos.reduce((total, item) => item.stakedUsdValue + total, 0)

  const canUpdateLiquidity = stakedPos.some(item => item.liquidity.gt(item.stakedLiquidity))
  const myTotalPosUSDValue = stakedPos.reduce((total, item) => item.positionUsdValue + total, 0)
  const notStakedUSD = myTotalPosUSDValue - myDepositUSD

  const { harvest } = useFarmV2Action()
  const handleHarvest = useCallback(() => {
    harvest(farm?.fId, stakedPos?.filter(sp => sp.rangeId === activeRangeIndex).map(sp => sp.nftId.toNumber()) || [])
  }, [farm, harvest, stakedPos, activeRangeIndex])

  const { pool } = farm

  const addliquidityElasticPool = `${APP_PATHS.ELASTIC_CREATE_POOL}/${
    pool.token0.isNative ? pool.token0.symbol : pool.token0.address
  }/${pool.token1.isNative ? pool.token1.symbol : pool.token1.address}/${pool.fee}`

  const rangesCount = farm.ranges.length

  const isEnded = farm.isSettled || currentTimestamp > farm.endTime

  return (
    <Wrapper>
      <WrapperInner ref={wrapperInnerRef} hasRewards={canUnstake}>
        <FrontFace>
          <RowBetween>
            <RowFit>
              <DoubleCurrencyLogo size={20} currency0={farm.token0} currency1={farm.token1} />
              <Link
                to={addliquidityElasticPool}
                style={{
                  textDecoration: 'none',
                }}
              >
                <Text fontSize="16px" lineHeight="20px" color={theme.primary} marginRight="4px">
                  {`${farm.token0.symbol} - ${farm.token1.symbol}`}
                </Text>
              </Link>
              <FeeBadge>FEE {farm?.pool?.fee ? (farm?.pool?.fee * 100) / ELASTIC_BASE_FEE_UNIT : 0.03}%</FeeBadge>
            </RowFit>
            <RowFit gap="8px">
              <IconButton>
                <CopyHelper toCopy={farm?.poolAddress || ''} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setSharePoolAddress(farm.poolAddress)
                }}
              >
                <Share2 size={14} fill="currentcolor" />
              </IconButton>
            </RowFit>
          </RowBetween>
          <RowBetween>
            <Text fontSize="12px" lineHeight="16px" color={theme.subText}>
              {!isEnded && <Trans>Current phase will end in</Trans>}
            </Text>
            <Text fontSize="12px" lineHeight="16px" color={theme.text}>
              {isEnded ? <Trans>ENDED</Trans> : getFormattedTimeFromSecond(farm.endTime - currentTimestamp)}
            </Text>
          </RowBetween>
          <RowBetween>
            <Column style={{ width: 'fit-content' }} gap="4px">
              <Text fontSize="12px" lineHeight="16px" color={theme.subText}>
                {hasRewards ? <Trans>My Rewards</Trans> : <Trans>Rewards</Trans>}
              </Text>
              <RowFit gap="8px">
                {farm.totalRewards.map((rw, index: number) => (
                  <>
                    {index > 0 && (
                      <Text fontSize="12px" lineHeight="16px" color={theme.border}>
                        |
                      </Text>
                    )}
                    <RowFit gap="4px">
                      <MouseoverTooltip text={rw.currency.symbol} placement="top" width="fit-content">
                        <CurrencyLogo currency={rw.currency} size="16px" />
                      </MouseoverTooltip>
                      {hasRewards && (
                        <Text fontSize="12px" lineHeight="16px" color={theme.text}>
                          {userTotalRewards[index].toSignificant(4)}
                        </Text>
                      )}
                    </RowFit>
                  </>
                ))}
              </RowFit>
            </Column>
            <ButtonLight width="fit-content" disabled={!hasRewards} onClick={handleHarvest}>
              <RowFit gap="4px">
                <Harvest />
                <Text>Harvest</Text>
              </RowFit>
            </ButtonLight>
          </RowBetween>
          <Divider />
          <Column
            gap="16px"
            style={{
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              padding: '12px',
              backgroundColor: theme.buttonBlack,
            }}
          >
            <RowBetween align="flex-start">
              <Column gap="4px" style={{ alignItems: 'flex-start' }}>
                <MouseoverTooltip text={t`Active Range: Current active farming range`} placement="top">
                  <Text
                    fontSize="12px"
                    lineHeight="16px"
                    color={theme.subText}
                    style={{ borderBottom: '1px dotted var(--subtext)' }}
                  >
                    <Trans>Avg APR</Trans>
                  </Text>
                </MouseoverTooltip>
                <Text fontSize="28px" lineHeight="32px" color={theme.apr}>
                  {(poolAPR + (farm.ranges[activeRangeIndex].apr || 0)).toFixed(2)}%
                </Text>
              </Column>
              <Column gap="4px" style={{ alignItems: 'flex-end' }}>
                <MouseoverTooltip
                  text={t`Add liquidity to ${farm.token0.symbol} - ${farm.token1.symbol} pool using the current active range`}
                  placement="top"
                >
                  <Text
                    fontSize="12px"
                    lineHeight="16px"
                    color={farm.ranges[activeRangeIndex].isRemoved ? theme.warning : theme.primary}
                    alignSelf="flex-end"
                    sx={{
                      borderBottom: farm.ranges[activeRangeIndex].isRemoved ? undefined : `1px dotted ${theme.primary}`,
                    }}
                  >
                    {farm.ranges[activeRangeIndex].isRemoved ? (
                      <Trans>Inactive Range</Trans>
                    ) : (
                      <Link to={`${addliquidityElasticPool}?farmRange=${activeRangeIndex}`}>
                        <Trans>Active Range ↗</Trans>
                      </Link>
                    )}
                  </Text>
                </MouseoverTooltip>
                <PriceVisualize
                  inactive={farm.ranges[activeRangeIndex].isRemoved}
                  tickRangeLower={farm.ranges[activeRangeIndex].tickLower}
                  tickRangeUpper={farm.ranges[activeRangeIndex].tickUpper}
                  tickCurrent={farm.ranges[activeRangeIndex].tickCurrent}
                  token0={farm.token0}
                  token1={farm.token1}
                />
              </Column>
            </RowBetween>
            <RowBetween>
              <Column gap="4px">
                <Text fontSize="12px" lineHeight="16px" color={theme.subText}>
                  <Trans>Staked TVL</Trans>
                </Text>
                <Text fontSize="16px" fontWeight="500" color={theme.text}>
                  {farm.ranges[activeRangeIndex].tvl ? formatDollarAmount(farm.ranges[activeRangeIndex].tvl) : '--'}
                </Text>
              </Column>
              <Column gap="4px" style={{ alignItems: 'flex-end' }}>
                <Text fontSize="12px" fontWeight="500" color={theme.subText}>
                  <Trans>My Deposit</Trans>
                </Text>
                <MouseoverTooltip
                  placement="bottom"
                  width="fit-content"
                  text={
                    !stakedPos.length ? (
                      ''
                    ) : (
                      <>
                        <Flex alignItems="center" sx={{ gap: '4px' }}>
                          <CurrencyLogo currency={amountToken0.currency} size="16px" />
                          {amountToken0.toSignificant(6)} {amountToken0.currency.symbol}
                        </Flex>

                        <Flex alignItems="center" sx={{ gap: '4px' }}>
                          <CurrencyLogo currency={amountToken1.currency} size="16px" />
                          {amountToken1.toSignificant(6)} {amountToken1.currency.symbol}
                        </Flex>
                      </>
                    )
                  }
                >
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    alignItems="center"
                    display="flex"
                    color={canUpdateLiquidity ? theme.warning : theme.text}
                  >
                    {formatDollarAmount(myTotalPosUSDValue)}
                    {!!stakedPos.length && <DownSvg />}
                  </Text>
                </MouseoverTooltip>
              </Column>
            </RowBetween>
            <Divider />
            <Row gap="12px">
              {canUnstake && (
                <UnstakeButton
                  color={canUpdateLiquidity ? theme.warning : theme.subText}
                  onClick={() => setShowUnstake(p => !p)}
                >
                  {canUpdateLiquidity && (
                    <InfoHelper
                      color={theme.warning}
                      size={14}
                      style={{ marginLeft: 0, marginRight: '2px' }}
                      width="270px"
                      text={
                        <Flex
                          sx={{
                            flexDirection: 'column',
                            gap: '6px',
                            fontSize: '12px',
                            lineHeight: '16px',
                            fontWeight: 400,
                          }}
                        >
                          <Text as="span" color={theme.subText}>
                            <Trans>
                              You still have {formatDollarAmount(notStakedUSD)} in liquidity to stake to earn even more
                              farming rewards
                            </Trans>
                          </Text>
                          <Text as="span" color={theme.text}>
                            Staked: {formatDollarAmount(myDepositUSD)}
                          </Text>
                          <Text as="span" color={theme.warning}>
                            Not staked: {formatDollarAmount(notStakedUSD)}
                          </Text>
                        </Flex>
                      }
                    />
                  )}
                  Manage Positions
                </UnstakeButton>
              )}
              <ButtonLight
                onClick={() => setShowStake(true)}
                disabled={!account || !isApproved || farm.ranges[activeRangeIndex].isRemoved || isEnded}
              >
                <RowFit gap="6px">
                  <Plus size={16} />
                  <Text fontSize={['12px', '14px']}>Stake</Text>
                </RowFit>
              </ButtonLight>
            </Row>
          </Column>
          <Row justify="center" marginTop="auto">
            <TextButtonPrimary
              disabled={rangesCount === 0}
              fontSize="12px"
              onClick={() => rangesCount > 0 && handleFlip()}
              width="fit-content"
            >
              <AspectRatio size={16} />
              <Trans>{rangesCount} Range(s) Available</Trans>
            </TextButtonPrimary>
          </Row>
        </FrontFace>

        <BackFace>
          <RowBetween>
            <RowFit gap="4px">
              <DoubleCurrencyLogo currency0={farm.token0} currency1={farm.token1} />
              <Text fontSize="16px" lineHeight="20px" color={theme.primary} marginLeft="4px">
                {`${farm.token0.symbol} - ${farm.token1.symbol}`}
              </Text>
              <FeeBadge>FEE {farm?.pool?.fee ? (farm?.pool?.fee * 100) / ELASTIC_BASE_FEE_UNIT : 0.03}%</FeeBadge>
            </RowFit>
            <RowFit gap="8px">
              <IconButton>
                <CopyHelper toCopy={farm.poolAddress} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setSharePoolAddress(farm.poolAddress)
                }}
              >
                <Share2 size={14} fill="currentcolor" />
              </IconButton>
            </RowFit>
          </RowBetween>
          <Ranges>
            <div style={{ overflowY: 'scroll', flex: 1 }}>
              <Column gap="12px">
                {farm.ranges.map((r, index: number) => (
                  <RangeItem
                    active={activeRangeIndex === index}
                    farmId={farm.fId}
                    key={r.id}
                    rangeInfo={r}
                    onRangeClick={() => setActiveRangeIndex(index)}
                    token0={farm.token0}
                    token1={farm.token1}
                    addLiquidityLink={`${addliquidityElasticPool}?farmRange=${r.index}`}
                  />
                ))}
              </Column>
            </div>
            <Row justify="center" marginTop="auto">
              <TextButtonPrimary fontSize="12px" onClick={handleFlip}>
                <Trans>Choose this range</Trans>
              </TextButtonPrimary>
            </Row>
          </Ranges>
        </BackFace>
      </WrapperInner>
      <StakeWithNFTsModal
        farm={farm}
        activeRangeIndex={activeRangeIndex}
        isOpen={showStake}
        onDismiss={() => setShowStake(false)}
      />
      {canUnstake && (
        <UnstakeWithNFTsModal
          farm={farm}
          activeRangeIndex={activeRangeIndex}
          isOpen={showUnstake}
          onDismiss={() => setShowUnstake(false)}
          stakedPos={stakedPos}
        />
      )}
    </Wrapper>
  )
}

export default React.memo(FarmCard)