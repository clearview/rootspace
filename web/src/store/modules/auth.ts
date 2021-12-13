import { Module } from 'vuex'

import { RootState, AuthState } from '@/types/state'

import AuthService from '@/services/auth'

type SigninContext = {
  type: string;
  payload: object;
}

const AuthModule: Module<AuthState, RootState> = {
  namespaced: true,
  state () {
    return {
      token: null,
      refreshToken: null,
      user: null,
      spaces: null,
      currentSpace: null
    }
  },

  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setRefreshToken (state, refreshToken) {
      state.refreshToken = refreshToken
    },
    setUser (state, user) {
      state.user = user
    }
  },

  actions: {
    async whoami ({ commit, dispatch }) {
      try {
        const { data } = await AuthService.whoami()

        commit('setUser', data.user)
        commit('space/setList', data.spaces, { root: true })

        await dispatch('space/initSetting', null, { root: true })
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
      commit('setRefreshToken', data.refreshToken)
    },
    async signout ({ commit }) {
      commit('setToken', null)
      commit('setRefreshToken', null)
      commit('setUser', null)
    },
    async recoverPassword (_, payload) {
      await AuthService.recoverPassword(payload)
    },
    async passwordReset (_, payload) {
      await AuthService.passwordReset(payload)
    },
    async passwordResetVerify (_, payload) {
      await AuthService.passwordResetVerify(payload)
    }
  }
}

export default AuthModule
