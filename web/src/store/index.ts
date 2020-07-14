import Vue from 'vue'
import Vuex from 'vuex'

// Types
import { RootState } from '@/types/state'

// Plugins
import local from '@/store/plugins/local'
import token from '@/store/plugins/token'

// Modules
import auth from '@/store/modules/auth'
import document from '@/store/modules/document'
import link from '@/store/modules/link'
import task from '@/store/modules/task/task'
import nav from '@/store/modules/nav'
import option from '@/store/modules/option'
import tree from '@/store/modules/tree'
import space from '@/store/modules/space'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    document,
    link,
    task,
    nav,
    option,
    tree,
    space
  },
  plugins: [
    local.plugin,
    token.plugin
  ]
})
