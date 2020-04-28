import VuexPersist from 'vuex-persist'

import { RootState } from '@/types/state'

const vuexSession = new VuexPersist<RootState>({
  key: 'root_session',
  storage: window.sessionStorage,
  modules: ['auth']
})

export default vuexSession
