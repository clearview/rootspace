import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent
} from 'typeorm'
import { Task } from '../entities/tasks/Task'
import { customAlphabet } from 'nanoid'
import slugify from '@sindresorhus/slugify'

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
  listenTo() {
    return Task
  }

  async beforeInsert(event: InsertEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)

    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8)
    task.shortUid = nanoid()
  }

  async beforeUpdate(event: InsertEvent<Task>) {
    const task = event.entity
    task.slug = slugify(task.title)
  }
}
