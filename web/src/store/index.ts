import Vue from 'vue'
import Vuex from 'vuex'

// Types
import { RootState } from '@/types/state'

// Plugins
import session from '@/store/plugins/session'
import local from '@/store/plugins/local'

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
    session.plugin,
    local.plugin
  ]
})
