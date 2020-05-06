import Cookie from 'js-cookie'

import { Store } from 'vuex'
import { RootState } from '@/types/state'

import { setAPIToken } from '@/utils/api'

const name = 'root_session'

function restore (store: Store<RootState>) {
  const token = Cookie.get(name) || null

  store.commit('auth/setToken', token)

  setAPIToken(token)
}

function save (token: string | null) {
  if (token) {
    Cookie.set(name, token)
  } else {
    Cookie.remove(name)
  }

  setAPIToken(token)
}

function plugin (store: Store<RootState>) {
  restore(store)

  store.subscribe((mutation, state) => {
    if (mutation.type === 'auth/setToken') {
      save(state.auth.token)
    }
  })
}

export default { plugin }
