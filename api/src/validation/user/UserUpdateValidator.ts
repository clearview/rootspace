import { validations } from 'indicative/validator'
import { BaseValidator } from '../../root/validation/BaseValidator'

export class UserUpdateValidator extends BaseValidator {
  userId: number

  constructor(userId: number) {
    super()
    this.userId = userId
  }

  rules() {
    return {
      firstName: 'accepted',
      lastName: 'accepted'
      // email: [
      //   validations.email(),
      //   validations.dbUnique(['User', 'user', 'email', this.userId]),
      // ],
    }
  }
}
