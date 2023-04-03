import KyberOauth2 from '@kybernetwork/oauth2'
import { Flex, Text } from 'rebass'

import { ButtonPrimary } from 'components/Button'
import { useActiveWeb3React } from 'hooks'
import useLogin from 'hooks/useLogin'
import useParsedQueryString from 'hooks/useParsedQueryString'

const SignIn = () => {
  const { session, sessionAnonymous } = useLogin()
  const { account } = useActiveWeb3React()

  const loginAccount = session?.userInfo?.wallet_address
  const isLogin = loginAccount && account
  const qs = useParsedQueryString()
  if (!qs.showInfo) return null
  return (
    <Flex
      justifyContent={'center'}
      style={{ gap: '10px' }}
      alignItems="center"
      flexDirection="column"
      width="100%"
      margin={'20px'}
    >
      {isLogin ? (
        <Text>Sign in user: {loginAccount}</Text>
      ) : (
        <Text>Anonymous user: {sessionAnonymous?.userInfo?.username}</Text>
      )}
      {isLogin ? (
        <ButtonPrimary width="100px" height="30px" onClick={() => KyberOauth2.logout()}>
          Sign out
        </ButtonPrimary>
      ) : (
        account && (
          <ButtonPrimary width="100px" height="30px" onClick={() => KyberOauth2.authenticate()}>
            Sign in
          </ButtonPrimary>
        )
      )}
    </Flex>
  )
}
export default SignIn
