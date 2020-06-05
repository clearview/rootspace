import Vue from 'vue'
import Vuex from 'vuex'

// Types
import { RootState } from '@/types/state'

// Plugins
import local from '@/store/plugins/local'
import token from '@/store/plugins/token'

// Modules
import auth from '@/store/modules/auth'
import link from '@/store/modules/link'
import task from '@/store/modules/task'
import nav from '@/store/modules/nav'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    link,
    task,
    nav
  },
  plugins: [
    local.plugin,
    token.plugin
  ]
})
