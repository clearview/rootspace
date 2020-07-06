import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent
} from 'typeorm'
import { Task } from '../entities/tasks/Task'
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

  async beforeUpdate(event: InsertEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }
}
