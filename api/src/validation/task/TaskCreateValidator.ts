import { BaseValidator } from '../BaseValidator'

export class TaskCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
      description: 'required'
    }
  }
}
