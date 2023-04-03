import KyberOauth2, { LoginMethod } from '@kybernetwork/oauth2'
import { useCallback, useEffect, useRef, useState } from 'react'

import { OAUTH_CLIENT_ID } from 'constants/env'
import { useActiveWeb3React } from 'hooks'
import { useIsConnectedWallet } from 'hooks/useSyncNetworkParamWithStore'

const useLogin = () => {
  const { account } = useActiveWeb3React()
  const isConnectedWallet = useIsConnectedWallet()

  const [session, setSession] = useState<any>()
  const [sessionAnonymous, setSessionAnonymous] = useState<any>()

  // prevent spam flag
  const requestingAnonymous = useRef(false)
  const requestingSession = useRef<string>()

  const signIn = useCallback(async function signIn(walletAddress: string | undefined) {
    const signInAnonymous = async () => {
      setSession(undefined)
      if (!requestingAnonymous.current) {
        requestingAnonymous.current = true
        const data = await KyberOauth2.loginAnonymous()
        setSessionAnonymous(data)
      }
    }
    try {
      const ClientAppConfig = {
        clientId: OAUTH_CLIENT_ID,
        redirectUri: `${window.location.protocol}//${window.location.host}`,
      }
      KyberOauth2.initialize(ClientAppConfig)
      if (requestingSession.current !== walletAddress) {
        requestingSession.current = walletAddress
        const data = await KyberOauth2.getSession({ method: LoginMethod.ETH, walletAddress })
        setSession(data)
      } else if (!walletAddress) {
        signInAnonymous()
      }
    } catch (error) {
      console.log('get session err', error)
      signInAnonymous()
    }
  }, [])

  useEffect(() => {
    isConnectedWallet().then(wallet => {
      signIn(typeof wallet === 'string' ? wallet : undefined)
    })
  }, [account, signIn, isConnectedWallet])

  return { session, sessionAnonymous }
}
export default useLogin
