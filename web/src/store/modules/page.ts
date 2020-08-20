import { Module } from 'vuex'
import { PageState, RootState } from '@/types/state'

const PageModule: Module<PageState, RootState> = {
  namespaced: true,
  state () {
    return {
      ready: false
    }
  },
  mutations: {
    setReady (state, ready) {
      state.ready = ready
    }
  }
}

export default PageModule
