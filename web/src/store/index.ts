import Vue from 'vue'
import Vuex from 'vuex'

// Types
import { RootState } from '@/types/state'

// Plugins
import token from '@/store/plugins/token'
// import userSetting from '@/store/plugins/userSetting'

// Modules
import * as modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules,
  plugins: [
    token.plugin
    // userSetting.plugin
  ]
})
