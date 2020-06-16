import { AbilityBuilder, Ability } from '@casl/ability'
import {User} from './entities/User'

export enum Actions {
    'create'= 'create',
    'read'= 'read',
    'update'= 'update',
    'delete'= 'delete',
}

export enum Objects {
    'TaskBoard'= 'TaskBoard',
    'TaskList'= 'TaskList',
    'Task'= 'Task'
}

export function defineAbilitiesFor(user: User): Ability {
    const { can, cannot, rules } = new AbilityBuilder()

    const ability = new Ability()
    ability.can(Actions.create, Objects.TaskBoard)

    can('read', ['TaskBoard', 'Comment'])
    can('create', 'User')

    if (user) {
        can('manage', ['TaskBoard', 'TaskList', 'Task'], { userId: user.id })
    }

    cannot('manage', 'all').because('Denied by default')
    return new Ability(rules)
}