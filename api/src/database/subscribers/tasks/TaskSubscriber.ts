import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, UpdateEvent
} from 'typeorm'
import { Task } from '../../entities/tasks/Task'
import slugify from '@sindresorhus/slugify'

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
  listenTo() {
    return Task
  }

  async beforeInsert(event: InsertEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }

  async beforeUpdate(event: UpdateEvent<Task>) {
    const task = event.entity

    // Soft-delete does not give a flying fudge about subscribers
    // https://github.com/typeorm/typeorm/issues/6349
    if (!task) {
      return
    }

    task.slug = slugify(task.title)
  }
}
