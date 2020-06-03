import { BaseValidator } from '../../BaseValidator'

export class TaskBoardCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      listId: 'required|number',
      title: 'required',
      description: 'required'
    }
  }
}
