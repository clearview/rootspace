import { Module } from 'vuex'

import { RootState, AuthState } from '@/types/state'
import { SpaceResource } from '@/types/resource'

import AuthService from '@/services/auth'

type SigninContext = {
  type: string;
  payload: object;
}

type WhoamiOptions = {
  updateSpace?: boolean;
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
    }
  },

  actions: {
    async whoami ({ commit, dispatch }, opts: WhoamiOptions = {}) {
      try {
        const { data } = await AuthService.whoami()

        commit('setUser', data.user)
        commit('space/setList', data.spaces, { root: true })
      } catch (err) {
        dispatch('signout')
      }
    },
    async signup (_, payload) {
      await AuthService.signup(payload)
    },
    async signin ({ commit }, { type, payload }: SigninContext) {
      const { data } = await AuthService.signin(type, payload)

      commit('setToken', data.token)
    },
    async signout ({ commit }) {
      commit('setToken', null)
      commit('setUser', null)
    }
  }
}

export default AuthModule
