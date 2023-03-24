import passport from '../passport'
import { NextFunction, Request, Response } from 'express'
import { Ability, AbilityBuilder } from '@casl/ability'

export enum Actions {
    'Manage'= 'manage',
    'Create'= 'create',
    'Read'= 'read',
    'Update'= 'update',
    'Delete'= 'delete'
}

export enum Subjects {
    'All' = 'all',
    'Doc' = 'Doc',
    'Link' = 'Link',
    'TaskBoard' = 'TaskBoard',
    'TaskList' = 'TaskList',
    'Task' = 'Task',
    'Storage' = 'Storage'
}

export const authenticate = passport.authenticate('jwt', {session: false})
export const authenticateRefreshToken = passport.authenticate('refreshToken', {session: false})

export function authorize(subject: Subjects, action?: Actions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { can, cannot, rules } = new AbilityBuilder()

        if (!req.user) { next() }

        await applyClassSpecificPermissions(req.user, can, cannot, rules)

        if (rules) {
            // @ts-ignore
            req.user.ability = new Ability<[Actions, Subjects]>(rules.concat(req.user.ability.rules))
        }

        next()
    }

    async function applyClassSpecificPermissions(user: any, can, cannot, rules) {
        switch (subject) {
            case Subjects.Link:
                break
            case Subjects.Doc:
                break
            case Subjects.TaskBoard:
                break
        }

        return rules
    }
}