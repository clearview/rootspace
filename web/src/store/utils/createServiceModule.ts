import { ResourceState, RootState } from '@/types/state'

import { ApiService } from '@/services/task'
import { ActionContext, Module } from 'vuex'
import { ApiResource } from '@/types/resource'

export interface Hooks<TResource> {
  afterFetch?(context: ActionContext<ResourceState<TResource>, RootState>, data: TResource[]): void;
  afterView?(context: ActionContext<ResourceState<TResource>, RootState>, data: TResource): void;
  afterCreate?(context: ActionContext<ResourceState<TResource>, RootState>, data: TResource): void;
  afterUpdate?(context: ActionContext<ResourceState<TResource>, RootState>, data: TResource): void;
  beforeUpdate?(context: ActionContext<ResourceState<TResource>, RootState>, data: TResource): void;
  afterDestroy?(context: ActionContext<ResourceState<TResource>, RootState>, data: TResource): void;
}

export function createServiceModule<TResource extends ApiResource, TParams> (service: ApiService<TResource, TParams>, hooks?: Hooks<TResource>): Module<ResourceState<TResource>, RootState> {
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
      },
      operate (state, operator: (board: ResourceState<TResource>) => void): void {
        operator(state)
      }
    },
    actions: {
      async fetch (context, params: TParams): Promise<void> {
        const activeSpace = context.rootGetters['space/activeSpace']

        if (!activeSpace) {
          throw new Error('There is no currently active space')
        }

        context.commit('setFetching', true)
        const res = await service.fetch(params)
        context.commit('setFetching', false)

        context.commit('setData', res)

        if (hooks && hooks.afterFetch) {
          hooks.afterFetch(context, res)
        }
      },

      async view (context, id: number): Promise<void> {
        context.commit('setFetching', true)
        const task = await service.view(id)
        context.commit('setFetching', false)

        context.commit('setCurrent', task?.data)
        if (task?.data && hooks && hooks.afterView) {
          hooks.afterView(context, task.data)
        }
      },

      async refresh (context): Promise<void> {
        if (context.state.current?.id) {
          context.commit('setFetching', true)
          const task = await service.view(context.state.current.id)
          context.commit('setFetching', false)
          context.commit('setCurrent', task?.data)
        }
      },

      async create (context, data: TResource): Promise<TResource> {
        context.commit('setProcessing', true)
        const res = await service.create(data)
        context.commit('setProcessing', false)
        if (hooks && hooks.afterCreate) {
          hooks.afterCreate(context, res)
        }
        return res
      },

      async update (context, data: TResource): Promise<TResource> {
        if (data.id === null) {
          throw new Error('Unable to update data without ID')
        }
        if (hooks && hooks.beforeUpdate) {
          hooks.beforeUpdate(context, data)
        }
        context.commit('setProcessing', true)
        const res = await service.update(data.id, data)
        context.commit('setProcessing', false)

        if (hooks && hooks.afterUpdate) {
          hooks.afterUpdate(context, res)
        }
        return res
      },

      async destroy (context, data: TResource): Promise<void> {
        if (data.id === null) {
          throw new Error('Unable to delete data without ID')
        }
        context.commit('setProcessing', true)
        await service.destroy(data.id)
        context.commit('setProcessing', false)

        if (hooks && hooks.afterDestroy) {
          hooks.afterDestroy(context, data)
        }
      }
    }
  }
}
