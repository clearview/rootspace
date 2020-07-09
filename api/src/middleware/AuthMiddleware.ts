import passport from '../passport'
import { NextFunction, Request, Response } from 'express'
import { Ability, AbilityBuilder } from '@casl/ability'
import { SpaceService } from '../services'

export enum Actions {
    'Create'= 'create',
    'Read'= 'read',
    'Update'= 'update',
    'Delete'= 'delete',
    'Manage'= 'manage',
}

export enum Subjects {
    'All' = 'all',
    'Doc' = 'Doc',
    'Link' = 'Link',
    'TaskBoard' = 'TaskBoard',
    'TaskList' = 'TaskList',
    'Task' = 'Task'
}

interface AuthorizationInfo { user: any, userSpaceIds: number[] }

export const authenticate = passport.authenticate('jwt', { session: false })

export function authorize (subject: Subjects, action?: Actions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { can, cannot, rules } = new AbilityBuilder()

        if (!req.user) { next() }

        const authorizationInfo = await getAuthorizationInfo(req)

        await applyGeneralRules(authorizationInfo, can, cannot)
        await applyClassSpecificRules(authorizationInfo, can, cannot, rules)

        // @ts-ignore
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
        // User can manage any subject they own
        can(Actions.Manage, [subject], { userId: authorizationInfo.user.id })

        // User can read any subject from the space they have access to
        can(Actions.Read, [subject], { spaceId: { $in: authorizationInfo.userSpaceIds } })

        // User can not create subjects outside spaces they belong to
        cannot(Actions.Create, [subject], { spaceId: { $nin: authorizationInfo.userSpaceIds } })
    }

    async function applyClassSpecificRules(authorizationInfo: AuthorizationInfo, can, cannot, rules) {
        switch (subject) {
            case Subjects.Doc:
                break
            case Subjects.TaskBoard:
                break
        }
    }
}