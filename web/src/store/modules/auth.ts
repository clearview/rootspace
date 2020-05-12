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
      spaces: null,
      currentSpace: null
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
    },
    setCurrentSpace (state, space) {
      state.currentSpace = space
    }
  },

  actions: {
    async withGoogle ({ commit }, params) {
      const { token } = await AuthService.googleCallback(params)

      commit('setToken', token)
    },
    async withEmail ({ commit }, params) {
      const res = await AuthService.localSignin(params)

      if (res) {
        commit('setToken', res.data.token)
      }
    },
    async whoami ({ commit }) {
      const res = await UserService.whoami()

      commit('setUser', res.user)
      commit('setSpaces', res.spaces)
      commit('setCurrentSpace', res.spaces[0]) // set default Space
    },
    async signout ({ commit }) {
      commit('setToken', null)
      commit('setUser', null)
      commit('setSpaces', null)
      commit('setCurrentSpace', null)
    }
  }
}

export default AuthModule
