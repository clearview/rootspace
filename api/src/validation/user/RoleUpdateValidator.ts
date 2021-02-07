import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'

export class RoleUpdateValidator extends BaseValidator {
  userId: number

  constructor(userId: number) {
    super()
    this.userId = userId
  }

  rules() {
    return {
      roleId: 'required',
      email: [
        validations.email(),
      ],
    }
  }
}
