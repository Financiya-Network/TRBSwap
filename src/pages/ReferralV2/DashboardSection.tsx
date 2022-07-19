import React, { useMemo, useState, useRef } from 'react'
import styled, { keyframes, DefaultTheme } from 'styled-components'
import { SectionTitle, SectionWrapper } from './styled'
import { Trans, t } from '@lingui/macro'
import { Flex, Box } from 'rebass'
import useTheme from 'hooks/useTheme'
import { MouseoverTooltip } from 'components/Tooltip'
import { ButtonOutlined, ButtonPrimary } from 'components/Button'
import DollarSignInCircle from 'components/Icons/DollarSignInCircle'
import MultiUser from 'components/Icons/MultiUser'
import DotInCircle from 'components/Icons/DotInCircle'
import greenBackground from 'assets/images/luxury-green-background.jpg'
import { useMedia } from 'react-use'
import { ReferrerInfo } from 'hooks/useReferralV2'
import { useKNCPrice } from 'state/application/hooks'
import { kncInUsdFormat } from 'utils'
import { useActiveNetwork } from 'hooks/useActiveNetwork'
import { ChainId } from '@kyberswap/ks-sdk-core'
import { useActiveWeb3React } from 'hooks'
import { NETWORKS_INFO } from 'constants/networks'
import { useOnClickOutside } from 'hooks/useOnClickOutside'

const highlight = (theme: DefaultTheme) => keyframes`
  0%{
    box-shadow: 0 0 5px 0px ${theme.primary};
  }
  100%{
    box-shadow: 0 0 10px 5px ${theme.primary};
  }
`

const TokenLabel = styled.div`
  font-size: 24px;
  line-height: 28px;
`

const USDLabel = styled.div`
  color: ${({ theme }) => theme.subText};
  font-size: 14px;
  line-height: 20px;
  margin-top: 8px;
`

const CardWrapper = styled(Box)<{ hasGreenBackground?: boolean }>`
  background: ${({ theme }) => theme.background};
  border-radius: 20px;
  height: 140px;
  padding: 20px;
  ${({ hasGreenBackground }) => hasGreenBackground && `background-image: url(${greenBackground});`}
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: bottom;

  &.highlight {
    animation: ${({ theme }) => highlight(theme)} 0.8s 8 alternate ease-in-out;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    button {
      width: 100%;
      margin-top: 20px;
    }
  `}
`

const CardTitle = styled.div<{ backgroundImage?: any }>`
  font-size: 16px;
  padding-bottom: 4px;
  border-bottom: 1px dotted ${({ theme }) => theme.subText};
`

const OptionsContainer = styled(Flex)`
  position: absolute;
  bottom: -4px;
  right: 0;
  border-radius: 20px;
  flex-direction: column;
  background: ${({ theme }) => theme.tableHeader};
  z-index: 9999;
  width: 100%;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.16);
  transform: translate(0, 100%);
  min-width: max-content !important;
  font-size: 12px;
  color: ${({ theme }) => theme.subText};
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  &:hover {
    background: ${({ theme }) => theme.background};
  }
`

export default React.forwardRef(
  (
    {
      referrerInfo,
      isHighlightClaim,
      onClaim,
    }: {
      referrerInfo: ReferrerInfo | undefined
      isHighlightClaim?: boolean
      onClaim: () => void
    },
    ref,
  ) => {
    const { chainId } = useActiveWeb3React()
    const { changeNetwork } = useActiveNetwork()
    const theme = useTheme()
    const above768 = useMedia('(min-width: 768px)')
    const kncPrice = useKNCPrice()

    const referrer = referrerInfo || { totalEarning: 0, claimableReward: 0, numReferrals: 0 }
    const claimable = referrerInfo?.claimableReward && referrerInfo.claimableReward > 0
    const totalEarningUSD = useMemo(() => {
      return kncInUsdFormat(referrer.totalEarning, kncPrice)
    }, [referrer, kncPrice])
    const claimableRewardUSD = useMemo(() => {
      return kncInUsdFormat(referrer.claimableReward, kncPrice)
    }, [referrer, kncPrice])
    const [showSwitchToNetwork, setShowSwitchToNetwork] = useState(false)
    const claimBtnRef = useRef(null)

    useOnClickOutside(claimBtnRef, () => setShowSwitchToNetwork(false))

    const productionEnv = window.location.href.includes('kyberswap')
    const isWrongNetwork = productionEnv ? chainId !== ChainId.MATIC : chainId !== ChainId.RINKEBY

    return (
      <SectionWrapper ref={ref as any}>
        <SectionTitle>
          <Trans>Dashboard</Trans>
        </SectionTitle>
        <Flex style={{ gap: '24px' }} flexDirection={above768 ? 'row' : 'column'}>
          <Flex style={{ gap: '24px' }} flex={6} order={above768 ? 1 : 2}>
            <CardWrapper flex={1}>
              <Flex marginBottom={'20px'} justifyContent={'space-between'}>
                <CardTitle>
                  <MouseoverTooltip
                    placement="top"
                    width="234px"
                    size={12}
                    text={t`Your total earnings from referring new users to KyberSwap`}
                  >
                    <Trans>Your Earnings</Trans>
                  </MouseoverTooltip>
                </CardTitle>
                <DotInCircle size={20} color={theme.subText} />
              </Flex>
              <TokenLabel>{referrer.totalEarning || 0} KNC</TokenLabel>
              <USDLabel>{totalEarningUSD} </USDLabel>
            </CardWrapper>
            <CardWrapper flex={1}>
              <Flex marginBottom={'20px'} justifyContent={'space-between'}>
                <CardTitle>
                  <MouseoverTooltip
                    placement="top"
                    size={12}
                    text={t`Number of users you have successfully referred to KyberSwap`}
                  >
                    <Trans>Number of Referrals</Trans>
                  </MouseoverTooltip>
                </CardTitle>
                <MultiUser size={20} color={theme.subText} />
              </Flex>
              <TokenLabel>{referrer.numReferrals || 0}</TokenLabel>
            </CardWrapper>
          </Flex>
          <CardWrapper
            flex={4}
            hasGreenBackground={claimable || false}
            order={above768 ? 2 : 1}
            className={isHighlightClaim ? 'highlight' : ''}
          >
            <Flex marginBottom={'20px'} justifyContent={'space-between'}>
              <CardTitle>
                <MouseoverTooltip
                  placement="top"
                  width="290px"
                  size={12}
                  text={t`Rewards you can claim instantly. Note: You will have to switch to Polygon network to claim your rewards`}
                >
                  <Trans>Your Claimable Rewards</Trans>
                </MouseoverTooltip>
              </CardTitle>
              <DollarSignInCircle size={20} color={claimable ? theme.primary : theme.subText} />
            </Flex>
            <Flex
              justifyContent={'space-between'}
              alignItems={above768 ? 'center' : 'flex-start'}
              flexDirection={above768 ? 'row' : 'column'}
            >
              <div>
                <TokenLabel>{referrer.claimableReward || 0} KNC</TokenLabel>
                <USDLabel>{claimableRewardUSD}</USDLabel>
              </div>
              {claimable ? (
                <ButtonPrimary
                  width={'146px'}
                  height={'44px'}
                  onClick={e => {
                    if (isWrongNetwork) {
                      setShowSwitchToNetwork(true)
                    } else {
                      onClaim()
                    }
                  }}
                  ref={claimBtnRef as any}
                >
                  <Trans>Claim</Trans>
                  {isWrongNetwork && (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="5"
                        viewBox="0 0 8 5"
                        fill="none"
                        style={{ position: 'absolute', right: '20px' }}
                      >
                        <path
                          d="M0.710051 1.71L3.30005 4.3C3.69005 4.69 4.32005 4.69 4.71005 4.3L7.30005 1.71C7.93005 1.08 7.48005 0 6.59005 0H1.41005C0.520051 0 0.0800515 1.08 0.710051 1.71Z"
                          fill="currentcolor"
                        />
                      </svg>
                      {showSwitchToNetwork &&
                        (productionEnv ? (
                          <OptionsContainer
                            onClick={e => {
                              e.stopPropagation()
                              setShowSwitchToNetwork(false)
                              changeNetwork(ChainId.MATIC)
                            }}
                          >
                            <img
                              src={NETWORKS_INFO[ChainId.MATIC].icon}
                              alt="Claim on Polygon"
                              style={{ width: '16px', marginRight: '4px' }}
                            />
                            <Trans>Claim on Polygon</Trans>
                          </OptionsContainer>
                        ) : (
                          <OptionsContainer
                            onClick={e => {
                              e.stopPropagation()
                              setShowSwitchToNetwork(false)
                              changeNetwork(ChainId.RINKEBY)
                            }}
                          >
                            <img
                              src={NETWORKS_INFO[ChainId.RINKEBY].icon}
                              alt="Claim on Rinkeby"
                              style={{ width: '16px', marginRight: '4px' }}
                            />
                            <Trans>Claim on Rinkeby</Trans>
                          </OptionsContainer>
                        ))}
                    </>
                  )}
                </ButtonPrimary>
              ) : (
                <ButtonOutlined disabled width={'104px'} height={'44px'}>
                  <Trans>Claim</Trans>
                </ButtonOutlined>
              )}
            </Flex>
          </CardWrapper>
        </Flex>
      </SectionWrapper>
    )
  },
)