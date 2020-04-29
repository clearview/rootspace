import { Module } from 'vuex'
import { RootState, NavState } from '@/types/state'

const NavModule: Module<NavState, RootState> = {
  namespaced: true,
  state () {
    return {
      size: '282px'
    }
  },

  mutations: {
    setSize (state, size) {
      state.size = size
    }
  }
}

export default NavModule
