import httpRequestContext from 'http-request-context'
import { User } from '../../../../database/entities/User'
import { IAppActivity, IAppActivityData, ActivityType } from '../types'
import { UserActions } from './actions'
import { Invite } from '../../../../database/entities/Invite'

const handlers = {
  [UserActions.Signup]: 'UserSignupHandler',
  [UserActions.EmailConfirmed]: 'UserEmailConfirmedHandler',
  [UserActions.Invite]: 'UserInviteHandler',
}

export class UserActivitiy implements IAppActivity {
  private _action: string
  private _actorId: number
  private _spaceId: number
  private _entityId: number
  private _entity: string
  private _context: any

  private constructor(action: string, entity: string, entityId: number, actorId?: number) {
    this._action = action
    this._entity = entity
    this._entityId = entityId

    this._actorId = actorId ?? httpRequestContext.get('user').id
  }

  static signup(user: User): UserActivitiy {
    return new UserActivitiy(UserActions.Signup, 'User', user.id, user.id)
  }

  static emailConfirmed(user: User): UserActivitiy {
    return new UserActivitiy(UserActions.EmailConfirmed, 'User', user.id, user.id)
  }

  static login(user: User): UserActivitiy {
    return new UserActivitiy(UserActions.Login, 'User', user.id, user.id)
  }

  static invite(invite: Invite, actorId?: number): UserActivitiy {
    const activitiy = new UserActivitiy(UserActions.Invite, 'Invite', invite.id, actorId)
    activitiy._spaceId = invite.spaceId

    return activitiy
  }

  getType() {
    return ActivityType.User
  }

  toObject(): IAppActivityData {
    return {
      actorId: this._actorId,
      spaceId: this._spaceId,
      entityId: this._entityId,
      entity: this._entity,
      action: this._action,
      type: this.getType(),
      context: this._context,
      handler: this.getHandler(),
    }
  }

  private getHandler(): string | null {
    if (handlers.hasOwnProperty(this._action)) {
      return handlers[this._action]
    }

    return null
  }
}
