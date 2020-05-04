import { Module } from 'vuex'
import { RootState, NavState } from '@/types/state'

const NavModule: Module<NavState, RootState> = {
  namespaced: true,
  state () {
    return {
      collapse: false,
      size: '282px'
    }
  },

  mutations: {
    setCollapse (state, collapse) {
      state.collapse = collapse
    },
    setSize (state, size) {
      state.size = size
    }
  }
}

export default NavModule
