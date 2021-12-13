import Cookie from 'js-cookie'

import { Store } from 'vuex'
import { RootState } from '@/types/state'

import { setAPIToken } from '@/utils/api'

const name = 'root_session'
const refreshTokenName = 'root_session_refresh_token'

function init (store: Store<RootState>) {
  const persistedToken = Cookie.get(name) || null
  const persistedRefreshToken = Cookie.get(refreshTokenName) || null

  store.commit('auth/setToken', persistedToken)
  store.commit('auth/setRefreshToken', persistedRefreshToken)

  store.subscribe((mutation, state) => {
    if (mutation.type === 'auth/setToken') {
      const { token } = state.auth

      if (token) {
        Cookie.set(name, token)
      } else {
        Cookie.remove(name)
      }
    }
    if (mutation.type === 'auth/setRefreshToken') {
      const { refreshToken } = state.auth

      if (refreshToken) {
        Cookie.set(refreshTokenName, refreshToken)
      } else {
        Cookie.remove(refreshTokenName)
      }
    }
  })
}

function plugin (store: Store<RootState>) {
  store.subscribe(async (mutation, state) => {
    if (mutation.type === 'auth/setToken') {
      setAPIToken(state.auth.token)
    }
  })

  init(store)
}

export default { plugin }
