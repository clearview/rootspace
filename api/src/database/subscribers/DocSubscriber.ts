import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent, UpdateEvent
} from 'typeorm'
import slugify from '@sindresorhus/slugify'
import { Doc } from '../entities/Doc'

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Doc> {
  listenTo() {
    return Doc
  }

  async beforeInsert(event: InsertEvent<Doc>) {
    const doc = event.entity
    doc.slug = slugify(doc.title)
  }

  async beforeUpdate(event: UpdateEvent<Doc>) {
    const doc = event.entity

    // Soft-delete does not give a flying fudge about subscribers
    // https://github.com/typeorm/typeorm/issues/6349
    if (!doc) {
      return
    }

    doc.slug = slugify(doc.title)
  }
}
