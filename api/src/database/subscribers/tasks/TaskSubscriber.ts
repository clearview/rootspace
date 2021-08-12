import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, UpdateEvent
} from 'typeorm'
import { Task } from '../../entities/tasks/Task'
import moment from 'moment'
import slugify from '@sindresorhus/slugify'

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
  listenTo() {
    return Task
  }

  async beforeInsert(event: InsertEvent<Task>) {
    const task = event.entity

    task.slug = slugify(task.title)
    task.isOverdue = TaskSubscriber.isOverdue(task)
  }

  async beforeUpdate(event: UpdateEvent<Task>) {
    const task:any = event.entity

    // Soft-delete does not give a flying fudge about subscribers
    // https://github.com/typeorm/typeorm/issues/6349
    if (!task) {
      return
    }

    task.slug = slugify(task.title)
    task.isOverdue = TaskSubscriber.isOverdue(task)
  }

  private static isOverdue(task: Task): boolean {
    if (!task.dueDate) {
      return false
    }

    const now = moment()
    const dueDate = moment(task.dueDate)

    return dueDate < now
  }
}
