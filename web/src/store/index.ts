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
import embed from '@/store/modules/embed'
import link from '@/store/modules/link'
import option from '@/store/modules/option'
import page from '@/store/modules/page'
import sidebar from '@/store/modules/sidebar'
import space from '@/store/modules/space'
import task from '@/store/modules/task/task'
import tree from '@/store/modules/tree'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    document,
    embed,
    link,
    option,
    page,
    space,
    sidebar,
    task,
    tree
  },
  plugins: [
    local.plugin,
    token.plugin
  ]
})
