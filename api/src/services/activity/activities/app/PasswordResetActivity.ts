import { PasswordReset } from '../../../../database/entities/PasswordReset'
import { AppActions } from './actions'
import { Activity } from '../Activity'
import { ActivityType } from '../types'

export class PasswordResetActivity extends Activity {
  constructor(action: string, entity: string, entityId: number, actorId?: number) {
    super(action)

    this._entity = entity
    this._entityId = entityId
    this._actorId = actorId
  }

  type(): string {
    return ActivityType.App
  }

  push(): boolean {
    return false
  }

  persist(): boolean {
    return true
  }

  handler(): string {
    return 'PasswordResetHandler'
  }

  static create(passwordReset: PasswordReset) {
    return new PasswordResetActivity(AppActions.Password_Reset, 'PasswordReset', passwordReset.id)
  }
}
