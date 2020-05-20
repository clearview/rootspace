import { Module } from 'vuex'
import { RootState, AuthState } from '@/types/state'

import AuthService from '@/services/auth'
import UserService from '@/services/user'

type SigninContext = {
  type: string;
  payload: object;
}

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
    async whoami ({ commit, state }) {
      const res = await UserService.whoami()

      commit('setUser', res.user)
      commit('setSpaces', res.spaces)

      if (!state.currentSpace) {
        commit('setCurrentSpace', res.spaces[0]) // set default Space
      }
    },
    async signin ({ commit }, { type, payload }: SigninContext) {
      const { data } = await AuthService.signin(type, payload)

      commit('setToken', data.token)
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
