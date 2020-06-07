import { BaseValidator } from '../../BaseValidator'
import { validations } from 'indicative/validator'

export class TaskBoardCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: [
        validations.required()
      ],
      type: [
        validations.integer(),
        validations.range([1, 2])
      ],
      title: [
        validations.required()
      ]
    }
  }
}
