import { ResourceState, RootState } from '@/types/state'

import { ApiService } from '@/services/task'
import { Module } from 'vuex'
import { ApiResource } from '@/types/resource'

export function createServiceModule<TResource extends ApiResource, TParams> (service: ApiService<TResource, TParams>): Module<ResourceState<TResource>, RootState> {
  return {
    namespaced: true,
    state (): ResourceState<TResource> {
      return {
        fetching: false,
        current: null,
        data: [],
        processing: false
      }
    },
    mutations: {
      setFetching (state, payload: boolean): void {
        state.fetching = payload
      },
      setCurrent (state, payload: TResource): void {
        state.current = payload
      },
      setData (state, payload: TResource[]): void {
        state.data = payload
      },
      setProcessing (state, payload: boolean): void {
        state.processing = payload
      }
    },
    actions: {
      async fetch ({ commit, rootState }, params: TParams): Promise<void> {
        const currentSpace = rootState.auth.currentSpace

        if (!currentSpace) {
          throw new Error('There is no currently active space')
        }

        commit('setFetching', true)
        const res = await service.fetch(params)
        commit('setFetching', false)

        commit('setData', res)
      },

      async view ({ commit }, id: number): Promise<void> {
        commit('setFetching', true)
        const task = await service.view(id)
        commit('setFetching', false)

        commit('setCurrent', task?.data)
      },

      async refresh ({ commit, state }): Promise<void> {
        if (state.current?.id) {
          commit('setFetching', true)
          const task = await service.view(state.current.id)
          commit('setFetching', false)
          commit('setCurrent', task?.data)
        }
      },

      async create ({ commit }, data: TResource): Promise<TResource> {
        commit('setProcessing', true)
        const res = await service.create(data)
        commit('setProcessing', false)
        return res
      },

      async update ({ commit }, data: TResource): Promise<TResource> {
        if (data.id === null) {
          throw new Error('Unable to update data without ID')
        }
        commit('setProcessing', true)
        const res = await service.update(data.id, data)
        commit('setProcessing', false)

        return res
      },

      async move ({ commit }, data: {parentId: number; entryId: number; position: number}) {
        if (data.entryId === null) {
          throw new Error('Unable to update data without ID')
        }
        commit('setProcessing', true)
        const res = await service.move(data.parentId, data.entryId, data.position)
        commit('setProcessing', false)

        return res
      },

      async destroy ({ commit }, data: TResource): Promise<void> {
        if (data.id === null) {
          throw new Error('Unable to delete data without ID')
        }
        commit('setProcessing', true)
        await service.destroy(data.id)
        commit('setProcessing', false)
      }
    }
  }
}
