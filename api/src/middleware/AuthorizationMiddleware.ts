import { Request, Response, NextFunction } from 'express'
import {Ability, AbilityBuilder} from '@casl/ability'

export enum Actions {
    'Create'= 'create',
    'Read'= 'read',
    'Update'= 'update',
    'Delete'= 'delete',
    'Manage'= 'manage',
}

export enum Objects {
    'Link'= 'Link'
}

// export function authorize (req: Request, res: Response, next: NextFunction) {
//     // tslint:disable-next-line:no-console
//     console.log('Time:', Date.now())
//
//     if (!req.user) {
//         // tslint:disable-next-line:no-console
//         console.log('NO USER')
//     }
//
//     // tslint:disable-next-line:no-console
//     console.log('User:', req.user.id)
//
//     next()
// }

export function authorize (action: Actions, object: Objects) {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log('MW Time:', Date.now())
        console.log('MW Action:', action)
        console.log('MW Object:', object)
        console.log('MW ID:', req.params.id)

        const { can, cannot, rules } = new AbilityBuilder()
        const ability = new Ability()

        if (!req.user) { next() }

        can(action, [object], { userId: req.user.id })

        req.user.ability = new Ability(rules)

        next()
    }
}