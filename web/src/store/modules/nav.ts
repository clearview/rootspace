import { Module } from 'vuex'
import { RootState, NavState } from '@/types/state'

const minSize = 282

const NavModule: Module<NavState, RootState> = {
  namespaced: true,
  state () {
    return {
      collapse: false,
      size: minSize
    }
  },

  mutations: {
    setCollapse (state, collapse) {
      state.collapse = collapse
    },
    setSize (state, size) {
      state.size = Math.max(minSize, size)
    }
  }
}

export default NavModule
