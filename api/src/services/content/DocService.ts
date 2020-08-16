import httpRequestContext from 'http-request-context'
import { getCustomRepository } from 'typeorm'
import { DocRepository } from '../../database/repositories/DocRepository'
import { Doc } from '../../database/entities/Doc'
import { DocCreateValue, DocUpdateValue } from '../../values/doc'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { DocActivities } from '../../database/entities/activities/DocActivities'
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { ActivityService } from '../ActivityService'
import { ServiceFactory } from '../factory/ServiceFactory'

export class DocService extends NodeContentService {
  private nodeService: NodeService
  private activityService: ActivityService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
    this.activityService = ServiceFactory.getInstance().getActivityService()
  }

  private static instance: DocService

  static getInstance() {
    if (!DocService.instance) {
      DocService.instance = new DocService()
    }

    return DocService.instance
  }

  getDocRepository(): DocRepository {
    return getCustomRepository(DocRepository)
  }

  getNodeType(): NodeType {
    return NodeType.Document
  }

  async getById(id: number, options: any = {}): Promise<Doc | undefined> {
    return this.getDocRepository().findOne(id, options)
  }

  async requireById(id: number, options: any = {}): Promise<Doc> {
    const doc = await this.getById(id, options)

    if (!doc) {
      throw clientError('Document not found', HttpErrName.EntityNotFound)
    }

    return doc
  }

  async create(data: DocCreateValue): Promise<Doc> {
    let doc = this.getDocRepository().create()

    Object.assign(doc, data.attributes)
    doc = await this.getDocRepository().save(doc)

    await this.nodeService.create(
      NodeCreateValue.fromObject({
        userId: doc.userId,
        spaceId: doc.spaceId,
        contentId: doc.id,
        title: doc.title,
        type: NodeType.Document,
      })
    )

    doc = await this.getDocRepository().reload(doc)
    await this.registerActivityForDoc(DocActivities.Created, doc)

    return doc
  }

  async update(data: DocUpdateValue, id: number): Promise<Doc> {
    let doc = await this.getById(id)

    Object.assign(doc, data.attributes)
    doc = await this.getDocRepository().save(doc)

    await this.registerActivityForDocId(DocActivities.Updated, doc.id)

    return this.getDocRepository().reload(doc)
  }

  async archive(id: number): Promise<Doc> {
    let doc = await this.getById(id)
    doc = await this._archive(doc)

    await this.nodeContentMediator.contentArchived(doc.id, this.getNodeType())

    return doc
  }

  async nodeArchived(contentId: number): Promise<void> {
    const doc = await this.getById(contentId)

    if (!doc) {
      return
    }

    await this._archive(doc)
  }

  private async _archive(_doc: Doc): Promise<Doc> {
    const doc = await this.getDocRepository().softRemove(_doc)
    await this.registerActivityForDoc(DocActivities.Archived, doc)

    return doc
  }

  async restore(docId: number): Promise<Doc> {
    let doc = await this.requireById(docId, { withDeleted: true })

    doc = await this._restore(doc)

    await this.nodeContentMediator.contentRestored(docId, this.getNodeType())
    await this.registerActivityForDoc(DocActivities.Restored, doc)

    return doc
  }

  async nodeRestored(contentId: number): Promise<void> {
    const doc = await this.getById(contentId, { withDeleted: true })

    if (!doc) {
      return
    }

    await this._restore(doc)
  }

  private async _restore(doc: Doc): Promise<Doc> {
    doc = await this.getDocRepository().recover(doc)
    return doc
  }

  async remove(id: number) {
    let doc = await this.requireById(id, { withDeleted: true })

    this._isDocDeletable(doc)
    doc = await this._remove(doc)

    await this.registerActivityForDoc(DocActivities.Deleted, doc)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType())

    return doc
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const doc = await this.getDocRepository().getById(contentId, {
      withDeleted: true,
    })
    await this._remove(doc)
  }

  private async _remove(doc: Doc) {
    return this.getDocRepository().remove(doc)
  }

  private _isDocDeletable(doc: Doc): void {
    if (doc.deletedAt === null) {
      throw clientError('Can not delete document', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  async registerActivityForDocId(docActivity: DocActivities, docId: number): Promise<Bull.Job> {
    const doc = await this.getById(docId)
    return this.registerActivityForDoc(docActivity, doc)
  }

  async registerActivityForDoc(docActivity: DocActivities, doc: Doc): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent.withAction(docActivity)
        .fromActor(actor.id)
        .forEntity(doc)
        .inSpace(doc.spaceId)
    )
  }
}
