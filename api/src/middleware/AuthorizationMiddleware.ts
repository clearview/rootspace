import { Request, Response, NextFunction } from 'express'
import {Ability, AbilityBuilder} from '@casl/ability'
import {SpaceService} from '../services'
import {User} from '../entities/User'

export enum Actions {
    'Create'= 'create',
    'Read'= 'read',
    'Update'= 'update',
    'Delete'= 'delete',
    'Manage'= 'manage',
}

export enum Objects {
    'All' = 'all',
    'Doc' = 'Doc',
    'Link' = 'Link',
    'TaskBoard' = 'TaskBoard'
}

interface AuthorizationInfo { user: User, userSpaceIds: number[] }

export function authorize (object: Objects, action?: Actions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { can, cannot, rules } = new AbilityBuilder()

        if (!req.user) { next() }

        const authorizationInfo = await getAuthorizationInfo(req)

        await applyGeneralRules(authorizationInfo, can, cannot)
        await applyClassSpecificRules(authorizationInfo, can, cannot, rules)

        req.user.ability = new Ability(rules)

        next()
    }

    async function getAuthorizationInfo(req: Request): Promise<AuthorizationInfo> {
        const userSpaces = await SpaceService.getInstance().getSpacesByUserId(req.user.id)
        const userSpaceIds = userSpaces.map(space => { return space.id })

        return {
            user: req.user,
            userSpaceIds
        }
    }

    async function applyGeneralRules(authorizationInfo: AuthorizationInfo, can, cannot) {
        // User can manage any object they own
        can(Actions.Manage, [object], { userId: authorizationInfo.user.id })

        // User can read any object from the space they have access to
        can(Actions.Read, [object], { spaceId: { $in: authorizationInfo.userSpaceIds } })

        // User can not create objects outside spaces they belong to
        cannot(Actions.Create, [object], { spaceId: { $nin: authorizationInfo.userSpaceIds } })
    }

    async function applyClassSpecificRules(authorizationInfo: AuthorizationInfo, can, cannot, rules) {
        switch (object) {
            case Objects.Doc:
                break
            case Objects.TaskBoard:
                break
        }
    }
}