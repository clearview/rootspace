import { Module } from 'vuex'
import { RootState, AuthState } from '@/types/state'

import AuthService from '@/services/auth'

const AuthModule: Module<AuthState, RootState> = {
  namespaced: true,
  state () {
    return {
      token: null,
      user: null,
      spaces: null
    }
  },

  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUser (state, user) {
      state.user = user
    },
    setSpaces (state, spaces) {
      state.spaces = spaces
    }
  },

  actions: {
    async withGoogle ({ commit }, params) {
      const { token } = await AuthService.googleCallback(params)
      commit('setToken', token)

      const userRes = await AuthService.whoami()
      commit('setUser', userRes.user)
      commit('setSpaces', userRes.spaces)
    }
  }
}

export default AuthModule
