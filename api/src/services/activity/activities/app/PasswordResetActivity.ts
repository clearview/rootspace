import { PasswordReset } from '../../../../database/entities/PasswordReset'
import { AppActivity } from './AppActivity'
import { AppActions } from './actions'

export class PasswordResetActivity extends AppActivity {
  getHandler() {
    return 'PasswordResetHandler'
  }

  static create(passwordReset: PasswordReset) {
    return new PasswordResetActivity(AppActions.Password_Reset, 'PasswordReset', passwordReset.id)
  }
}
