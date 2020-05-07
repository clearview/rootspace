import { Module } from 'vuex'
import { RootState, AuthState } from '@/types/state'

import AuthService from '@/services/auth'
import UserService from '@/services/user'

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
    async withGoogle ({ commit, dispatch }, params) {
      const { token } = await AuthService.googleCallback(params)

      commit('setToken', token)

      await dispatch('whoami')
    },
    async withEmail ({ commit, dispatch }, params) {
      const res = await AuthService.localSignin(params)

      if (res) {
        commit('setToken', res.data.token)
      }

      await dispatch('whoami')
    },
    async whoami ({ commit }) {
      const res = await UserService.whoami()

      commit('setUser', res.user)
      commit('setSpaces', res.spaces)
    },
    async signout ({ commit }) {
      commit('setToken', null)
      commit('setUser', null)
      commit('setSpaces', null)
    }
  }
}

export default AuthModule
