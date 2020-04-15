import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import Cookies from 'js-cookie'

import auth from './modules/auth'

Vue.use(Vuex)

export interface State {
  auth: {
    token: null;
  };
}

const vuexCookie = new VuexPersist<State>({
  key: 'root_state',
  reducer: (state) => ({
    auth: {
      token: state.auth.token
    }
  }),
  filter: ({ type }) => (
    type === 'auth/setToken'
  ),
  restoreState: (key) => Cookies.getJSON(key),
  saveState: (key, state) => {
    Cookies.set(key, state, {
      expires: 30
    })
  }
})

export default new Vuex.Store({
  modules: {
    auth
  },
  plugins: [vuexCookie.plugin]
})
