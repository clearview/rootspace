import { Doc } from '../../../../database/entities/Doc'
import { ContentActivity, IContentActivity } from '.'
import { ContentActions } from './actions'
import { DocUpdateSetup } from '../../../content/doc/DocUpdateSetup'

export class DocActivity extends ContentActivity<Doc> {
  protected docUpdateSetup: DocUpdateSetup

  constructor(action: string, entity: Doc, actorId?: number) {
    super(action, entity, actorId)

    this._filterEntityAttributes = ['id', 'title']
    this._notifyUpdatedAttributes = ['id', 'title']

    this._handler = 'DocActivityHandler'
  }

  getEntityName(): string {
    return 'Doc'
  }

  static created(entity: Doc, actorId?: number): IContentActivity {
    return new DocActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Doc, updatedEntity: Doc, docUpdateSetup: DocUpdateSetup, actorId?: number): IContentActivity {
    const activity = new DocActivity(ContentActions.Updated, entity, actorId)
    activity.docUpdateSetup = docUpdateSetup

    return activity.updated(updatedEntity)
  }

  static archived(entity: Doc, actorId?: number): IContentActivity {
    return new DocActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Doc, actorId?: number): IContentActivity {
    return new DocActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Doc, actorId?: number): IContentActivity {
    return new DocActivity(ContentActions.Deleted, entity, actorId).deleted()
  }

  protected updated(updatedEntity: Doc): ContentActivity<Doc> {
    const updatedAttributes = this.notifyUpdatedAttributes(this._entity, updatedEntity)

    if (this.docUpdateSetup.contentUpdated) {
      updatedAttributes.push('content')
    }

    this._context = {
      updatedAttributes,
      entity: this.filterEntityAttributes(this._entity),
      updatedEntity: this.filterEntityAttributes(updatedEntity),
    }

    return this
  }
}
