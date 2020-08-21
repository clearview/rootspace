import VuexPersist from 'vuex-persist'

import { RootState } from '@/types/state'

const vuexSession = new VuexPersist<RootState>({
  key: 'root_data',
  storage: window.localStorage,
  reducer (state) {
    return {
      nav: state.nav,
      sidebar: state.sidebar,
      auth: {
        spaces: state.auth.spaces,
        currentSpace: state.auth.currentSpace
      },
      option: state.option,
      space: state.space,
      tree: {
        folded: state.tree.folded
      },
      task: {
        settings: state.task.settings
      }
    }
  }
})

export default vuexSession
