import { BaseValidator } from '../BaseValidator'

export class TaskUpdateValidator extends BaseValidator {
  rules() {
    return {
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
