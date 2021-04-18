import { validations } from 'indicative/validator'
import { BaseValidator } from '../../../root/validation/BaseValidator'
import { SpaceUserRole } from '../../../types/spaceUser'

export class SpaceUserUpdateValidator extends BaseValidator {
  rules() {
    return {
      role: [validations.number(), validations.in(Object.values(SpaceUserRole))],
    }
  }
}
