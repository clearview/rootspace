import { Module } from 'vuex'
import { RootState, ErrorState } from '@/types/state'

const ErrorModule: Module<ErrorState, RootState> = {
  namespaced: true,
  state () {
    return {
      showErrorMessage: false,
      errorMessage: null
    }
  },

  mutations: {
    setError (state, body) {
      if (body === null) {
        state.showErrorMessage = false
        state.errorMessage = null
      } else {
        state.showErrorMessage = true
        state.errorMessage = body
      }
    }
  }
}

export default ErrorModule
