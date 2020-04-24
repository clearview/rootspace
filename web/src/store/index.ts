import Vue from 'vue'
import Vuex from 'vuex'

// Types
import { RootState } from '@/types/state'

// Plugins
import cookie from '@/store/plugins/cookie'

// Modules
import auth from '@/store/modules/auth'
import link from '@/store/modules/link'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    link
  },
  plugins: [
    cookie.plugin
  ]
})
