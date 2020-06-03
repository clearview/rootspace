import { BaseValidator } from '../../BaseValidator'

export class TaskListCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      listId: 'required|number',
      title: 'required',
      description: 'required'
    }
  }
}
