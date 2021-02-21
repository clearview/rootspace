import httpRequestContext from 'http-request-context'
import { User } from '../../../../database/entities/User'
import { Invite } from '../../../../database/entities/Invite'
import { Activity } from '../Activity'
import { ActivityType } from '../types'
import { UserActions } from './actions'

const handlers = {
  [UserActions.Signup]: 'UserSignupHandler',
  [UserActions.EmailConfirmed]: 'UserEmailConfirmedHandler',
  [UserActions.Invite]: 'UserInviteHandler',
}

export class UserActivitiy extends Activity {
  private constructor(action: string, entity: string, entityId: number, actorId?: number) {
    super(action)

    this._entityName = entity
    this._entityId = entityId
    this._actorId = actorId ?? httpRequestContext.get('user').id
  }

  type(): string {
    return ActivityType.User
  }

  push(): boolean {
    return false
  }

  persist(): boolean {
    return true
  }

  handler(): string | null {
    if (handlers.hasOwnProperty(this._action)) {
      return handlers[this._action]
    }

    return null
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
}
