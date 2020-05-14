import Cookie from 'js-cookie'

import { Store } from 'vuex'
import { RootState } from '@/types/state'

import { setAPIToken } from '@/utils/api'

const name = 'root_session'

function init (store: Store<RootState>) {
  const persistedToken = Cookie.get(name) || null

  store.commit('auth/setToken', persistedToken)

  store.subscribe((mutation, state) => {
    if (mutation.type === 'auth/setToken') {
      const { token } = state.auth

      if (token) {
        Cookie.set(name, token)
      } else {
        Cookie.remove(name)
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
