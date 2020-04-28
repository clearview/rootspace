import VuexPersist from 'vuex-persist'

import { RootState } from '@/types/state'

const vuexSession = new VuexPersist<RootState>({
  key: 'root_data',
  storage: window.localStorage,
  reducer (state) {
    return {}
  }
})

export default vuexSession
