import httpRequestContext from 'http-request-context'
import { getCustomRepository } from 'typeorm'
import { DocRepository } from '../../../database/repositories/DocRepository'
import { DocRevisionRepository } from '../../../database/repositories/DocRevisionRepository'
import { Doc } from '../../../database/entities/Doc'
import { DocCreateValue, DocUpdateValue } from '../../../values/doc'
import { NodeCreateValue } from '../../../values/node'
import { NodeType } from '../../../types/node'
import { NodeService } from '../NodeService'
import { NodeContentService } from '../NodeContentService'
import { clientError, HttpErrName, HttpStatusCode } from '../../../errors'
import { DocActivities } from '../../../database/entities/activities/DocActivities'
import Bull from 'bull'
import { ActivityEvent } from '../../events/ActivityEvent'
import { ActivityService } from '../../ActivityService'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { DocUpdateSetup } from './DocUpdateSetup'

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

  getDocRevisionRepository(): DocRevisionRepository {
    return getCustomRepository(DocRevisionRepository)
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
    await this.registerActivityForDoc(DocActivities.Created, doc, { title: doc.title })

    return doc
  }

  async update(data: DocUpdateValue, id: number): Promise<Doc> {
    const existingDoc = await this.getById(id)
    let doc = await this.getById(id)

    const setup = new DocUpdateSetup(data, doc, userId)

    console.log('Content updated: ' + setup.contentUpdated)
    console.log('Create revision: ' + setup.createRevision)
    console.log('Register activity: ' + setup.registerActivity)

    if (setup.contentUpdated === true) {
      doc.contentUpdatedAt = new Date(Date.now())
    }

    if (setup.createRevision === true) {
      this.createRevision(doc)
      doc.revision = doc.revision + 1
    }

    Object.assign(doc, data.attributes)
    doc.updatedBy = userId

    doc = await this.getDocRepository().save(doc)

    /**
     * Todo: register context within session
     * since content updates are too frequent
     */
    const fields = { old: {}, new: {} }

    for (const key of Object.keys(data.attributes)) {
      if (key === 'title' && data.attributes[key] !== existingDoc[key]) {
        fields.old[key] = existingDoc[key]
        fields.new[key] = doc[key]
      }
    }

    if (Object.keys(fields.new).length) {
      await this.registerActivityForDocId(DocActivities.Updated, doc.id, fields)
    }

    return this.getDocRepository().reload(doc)
  }

  private async createRevision(doc: Doc): Promise<void> {
    const attributes = ['userId', 'spaceId', 'title', 'slug', 'content']

    const docRevision = this.getDocRevisionRepository().create()

    for (const attribute of attributes) {
      docRevision[attribute] = doc[attribute]
    }

    docRevision.docId = doc.id
    docRevision.revisionBy = doc.updatedBy ?? doc.userId
    docRevision.revisionAt = doc.updatedAt ?? doc.createdAt

    await this.getDocRevisionRepository().save(docRevision)
  }

  async archive(id: number): Promise<Doc> {
    let doc = await this.getById(id, { withDeleted: true })
    this.verifyArchive(doc)

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
    await this.registerActivityForDoc(DocActivities.Archived, doc, { title: doc.title })

    return doc
  }

  async restore(docId: number): Promise<Doc> {
    let doc = await this.requireById(docId, { withDeleted: true })
    this.verifyRestore(doc)

    doc = await this._restore(doc)

    await this.nodeContentMediator.contentRestored(docId, this.getNodeType())
    await this.registerActivityForDoc(DocActivities.Restored, doc, { title: doc.title })

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
    // this.verifyRemove(doc)

    doc = await this._remove(doc)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType())

    return doc
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const doc = await this.getDocRepository().getById(contentId, {
      withDeleted: true,
    })

    if (doc) {
      await this._remove(doc)
    }
  }

  private async _remove(doc: Doc) {
    await this.registerActivityForDoc(DocActivities.Deleted, doc, { title: doc.title })
    return this.getDocRepository().remove(doc)
  }

  private verifyArchive(doc: Doc): void {
    if (doc.deletedAt !== null) {
      throw clientError('Can not archive link', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRestore(doc: Doc) {
    if (doc.deletedAt === null) {
      throw clientError('Can not restore link', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRemove(doc: Doc): void {
    if (doc.deletedAt === null) {
      throw clientError('Can not delete link', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  async registerActivityForDocId(docActivity: DocActivities, docId: number, context?: any): Promise<Bull.Job> {
    const doc = await this.getById(docId)
    return this.registerActivityForDoc(docActivity, doc, context)
  }

  async registerActivityForDoc(docActivity: DocActivities, doc: Doc, context?: any): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent.withAction(docActivity)
        .fromActor(actor.id)
        .forEntity(doc)
        .inSpace(doc.spaceId)
        .withContext(context)
    )
  }
}
