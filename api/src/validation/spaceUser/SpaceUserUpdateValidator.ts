import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'
import { SpaceUserRole } from '../../types/spaceUser'

export class SpaceUserUpdateValidator extends BaseValidator {
  rules() {
    return {
      role: [validations.number(), validations.in(Object.values(SpaceUserRole))],
    }
  }
}
