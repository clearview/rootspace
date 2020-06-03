import { BaseValidator } from '../../BaseValidator'

export class TaskListUpdateValidator extends BaseValidator {
  rules() {
    return {
      listId: 'number',
      assignedTo: 'object',
      title: 'accepted',
      description: 'accepted',
      status: 'number|above:0',
      tags: 'object',
      attachments: 'object',
      dueDate: 'accepted',
      order: 'number|above:0'
    }
  }
}
