import Vue from 'vue'
import Vuex from 'vuex'

// Types
import { RootState } from '@/types/state'

// Plugins
import cookie from './plugins/cookie'

// Modules
import auth from './modules/auth'
import link from './modules/link'
import error from './modules/error'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    link,
    error
  },
  plugins: [
    cookie.plugin
  ]
})
