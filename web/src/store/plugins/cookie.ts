import VuexPersist from 'vuex-persist'
import Cookies from 'js-cookie'

import { RootState } from '@/types/state'

const vuexCookie = new VuexPersist<RootState>({
  key: 'root_state',
  reducer: (state) => ({
    auth: {
      token: state.auth.token,
      user: state.auth.user,
      spaces: state.auth.spaces
    }
  }),
  filter: ({ type }) => (
    type === 'auth/setToken' ||
    type === 'auth/setUser' ||
    type === 'auth/setSpaces'
  ),
  restoreState: (key) => Cookies.getJSON(key),
  saveState: (key, state) => {
    Cookies.set(key, state, {
      expires: 30
    })
  }
})

export default vuexCookie
