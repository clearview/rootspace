import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'

export class UserUpdateValidator extends BaseValidator {
  private userId: number

  constructor(userId: number) {
    super()
    this.userId = userId
  }

  rules() {
    return {
      firstName: 'required',
      lastName: 'required',
      email: [
        validations.required(),
        validations.email(),
        validations.dbUnique(['User', 'user', 'email', this.userId]),
      ],
    }
  }
}
