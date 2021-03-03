import { InjectionKey, Ref } from '@vue/composition-api'

export type AccessRole = 'admin' | 'member'

export const accessRoleKey: InjectionKey<Ref<number>> = Symbol('accessRole')
