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
      user: null,
      spaces: null,
      currentSpace: null
    }
  },

  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUserRole (state, value) {
      if (state.user) {
        state.user.hasRole = value
      }
    },
    setUserRoleId (state, value) {
      if (state.user) {
        state.user.hasRoleId = value
      }
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
    async hasRoles ({ commit }, payload) {
      try {
        const { data } = await AuthService.getUserRolesBySpaceId(payload.spaceId, payload.userId)

        if (!payload.hasRoles || payload.hasRoles?.includes(data?.roleId)) {
          commit('setUserRole', true)
          return true
        }

        commit('setUserRole', false)

        return false
      } catch (err) {
        throw new Error('Something went wrong')
      }
    },
    async setUserRoles ({ commit }, payload) {
      try {
        const { data } = await AuthService.getUserRolesBySpaceId(payload.spaceId, payload.userId)

        commit('setUserRoleId', data?.roleId)
      } catch (err) {
        throw new Error('Something went wrong')
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
