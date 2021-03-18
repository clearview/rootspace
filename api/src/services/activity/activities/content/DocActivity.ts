import { Doc } from '../../../../database/entities/Doc'
import { IDocUpdateSetup } from '../../../../types/doc'
import { ContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class DocActivity extends ContentActivity<Doc> {
  protected docUpdateSetup: IDocUpdateSetup

  constructor(action: string, entity: Doc, actorId: number) {
    super(action, entity, actorId)

    this._entityAttributes = ['id', 'title']
    this._entityUpdateAttributes = ['id', 'title']
  }

  getEntityName(): string {
    return 'Doc'
  }

  handler(): string {
    return 'DocActivityHandler'
  }

  static created(entity: Doc, actorId: number) {
    return new DocActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Doc, updatedEntity: Doc, docUpdateSetup: IDocUpdateSetup, actorId: number) {
    const activity = new DocActivity(ContentActions.Updated, entity, actorId)
    activity.docUpdateSetup = docUpdateSetup

    return activity.updated(updatedEntity)
  }

  static archived(entity: Doc, actorId: number) {
    return new DocActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Doc, actorId: number) {
    return new DocActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Doc, actorId: number) {
    return new DocActivity(ContentActions.Deleted, entity, actorId).deleted()
  }

  updated(updatedEntity: Doc) {
    const updatedAttributes = this._getUpdatedAttributes(this._entity, updatedEntity, this._entityUpdateAttributes)

    if (this.docUpdateSetup.contentUpdated) {
      updatedAttributes.push('content')
    }

    this._context = {
      updatedAttributes,
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
      updatedEntity: this._filterEntityAttributes(updatedEntity, this._entityAttributes),
    }

    return this
  }
}
