import { goTo } from './utils'
import login from './plugin'
import { type BottomAction } from '.'
import { setMetadataLocalStorage } from '@digitranslab/ui'
import { setMetadata } from '@digitranslab/platform'
import presentation from '@digitranslab/presentation'

export const signUpAction: BottomAction = {
  caption: login.string.DoNotHaveAnAccount,
  i18n: login.string.SignUp,
  page: 'signup',
  func: () => {
    goTo('signup')
  }
}

export const loginAction: BottomAction = {
  caption: login.string.AlreadyJoined,
  i18n: login.string.LogIn,
  page: 'login',
  func: () => {
    setMetadata(presentation.metadata.Token, null)
    setMetadataLocalStorage(login.metadata.LastToken, null)
    goTo('login', true)
  }
}

export const recoveryAction: BottomAction = {
  caption: login.string.ForgotPassword,
  i18n: login.string.Recover,
  page: 'password',
  func: () => {
    goTo('password', true)
  }
}
