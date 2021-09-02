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

  private setDoc(event: InsertEvent<Doc> | UpdateEvent<Doc>) {
    const doc = event.entity
    const title = doc.title ?? ' '
    doc.slug = slugify(title)
    doc.title = title

    return doc
  }

  async beforeInsert(event: InsertEvent<Doc>) {
    return this.setDoc(event)
  }

  async beforeUpdate(event: UpdateEvent<Doc>) {
    const doc = this.setDoc(event)

    // Soft-delete does not give a flying fudge about subscribers
    // https://github.com/typeorm/typeorm/issues/6349
    if (!doc) {
      return
    }

    doc.slug = slugify(doc.title)

    return doc
  }
}
