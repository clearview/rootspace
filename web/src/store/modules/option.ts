import { Module } from 'vuex'
import { RootState, OptionState } from '@/types/state'

const OptionModule: Module<OptionState, RootState> = {
  namespaced: true,
  state () {
    return {
      redirect: null
    }
  },

  mutations: {
    setRedirect (state, redirect) {
      state.redirect = redirect
    }
  }
}

export default OptionModule
