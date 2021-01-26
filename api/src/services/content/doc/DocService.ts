import httpRequestContext from 'http-request-context'
import { getCustomRepository } from 'typeorm'
import { DocRepository } from '../../../database/repositories/DocRepository'
import { DocRevisionRepository } from '../../../database/repositories/DocRevisionRepository'
import { Node } from '../../../database/entities/Node'
import { Doc } from '../../../database/entities/Doc'
import { DocRevision } from '../../../database/entities/DocRevision'
import { DocCreateValue, DocUpdateValue } from '../../../values/doc'
import { NodeCreateValue } from '../../../values/node'
import { NodeType } from '../../../types/node'
import { NodeService, NodeContentService } from '../../index'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../../../response/errors'
import { DocUpdateSetup } from './DocUpdateSetup'
import { DocActivity } from '../../activity/activities/content/index'
import { INodeContentUpdate } from '../contracts'
import { NovaDocUpdateSetup } from './NovaDocUpdateSetup'

export class DocService extends NodeContentService {
  private nodeService: NodeService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
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
      throw clientError('Document not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return doc
  }

  getDocRevisionById(id: number): Promise<DocRevision | undefined> {
    return this.getDocRevisionRepository().findOne(id)
  }

  async requireDocRevisionById(id: number, options: any = {}): Promise<DocRevision> {
    const docRevision = await this.getDocRevisionById(id)

    if (!docRevision) {
      throw clientError('Document revision not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return docRevision
  }

  async getDocRevisons(docId: number): Promise<DocRevision[]> {
    const doc = await this.requireById(docId)
    return this.getDocRevisionRepository().getByDocId(doc.id)
  }

  async create(data: DocCreateValue): Promise<Doc & Node> {
    let doc = this.getDocRepository().create()

    Object.assign(doc, data.attributes)
    doc.revision = 1

    doc = await this.getDocRepository().save(doc)

    let value = NodeCreateValue.fromObject({
      userId: doc.userId,
      spaceId: doc.spaceId,
      contentId: doc.id,
      title: doc.title,
      type: NodeType.Document,
      config: data.nodeConfig,
    })

    if (data.attributes.parentId) {
      value = value.withParent(data.attributes.parentId).withPosition(0)
    }

    const node = await this.nodeService.create(value)

    doc = await this.getDocRepository().reload(doc)
    await this.notifyActivity(DocActivity.created(doc))

    return { ...doc, ...node }
  }

  async update(data: DocUpdateValue, id: number, actorId: number): Promise<Doc> {
    const doc = await this.requireById(id)
    const updatedDoc = await this._update(data, doc, actorId)

    if (doc.title !== updatedDoc.title) {
      await this.nodeContentMediator.contentUpdated(updatedDoc.id, this.getNodeType(), {
        title: updatedDoc.title,
      })
    }

    return updatedDoc
  }

  async nodeUpdated(contentId: number, data: INodeContentUpdate): Promise<void> {
    if (!data.title) {
      return
    }

    const doc = await this.getById(contentId)

    if (!doc) {
      return
    }

    const value = DocUpdateValue.fromObject({
      title: data.title,
    })

    const actorId = httpRequestContext.get('user').id

    await this._update(value, doc, actorId)
  }

  private async _update(data: DocUpdateValue, doc: Doc, actorId: number): Promise<Doc> {
    const node = await this.nodeService.getNodeByContentId(doc.id, this.getNodeType())
    let updatedDoc = await this.getById(doc.id)

    const setup =
      node.config?.novaDoc === true
        ? new NovaDocUpdateSetup(data, updatedDoc, actorId)
        : new DocUpdateSetup(data, updatedDoc, actorId)

    if (setup.createRevision === true) {
      await this.createRevision(doc)
      updatedDoc.revision = updatedDoc.revision + 1
    }

    if (node.config?.novaDoc === true || setup.contentUpdated === true) {
      updatedDoc.contentUpdatedAt = new Date(Date.now())
      updatedDoc.contentUpdatedBy = actorId
    }

    Object.assign(updatedDoc, data.attributes)

    updatedDoc = await this.getDocRepository().save(updatedDoc)
    updatedDoc = await this.getDocRepository().reload(updatedDoc)

    if (setup.registerActivity) {
      await this.notifyActivity(DocActivity.updated(doc, updatedDoc, setup, actorId))
    }

    return updatedDoc
  }

  private async createRevision(doc: Doc): Promise<void> {
    const docRevision = this.getDocRevisionRepository().create()

    docRevision.userId = doc.userId
    docRevision.spaceId = doc.spaceId
    docRevision.docId = doc.id
    docRevision.content = doc.content
    docRevision.contentState = doc.contentState
    docRevision.number = doc.revision
    docRevision.revisionBy = doc.contentUpdatedBy ?? doc.userId
    docRevision.revisionAt = doc.contentUpdatedAt ?? doc.createdAt

    await this.getDocRevisionRepository().save(docRevision)
  }

  async restoreRevision(revisionId: number, actorId: number): Promise<Doc> {
    const docRevision = await this.requireDocRevisionById(revisionId)
    const doc = await this.requireById(docRevision.docId)
    const node = await this.nodeService.getNodeByContentId(doc.id, this.getNodeType())

    let updatedDoc = await this.requireById(docRevision.docId)

    const data = DocUpdateValue.fromObject({ content: docRevision.content, contentState: docRevision.contentState })

    const setup =
      node.config?.novaDoc === true
        ? new NovaDocUpdateSetup(data, updatedDoc, actorId)
        : new DocUpdateSetup(data, updatedDoc, actorId)

    if (setup.contentUpdated === false) {
      return updatedDoc
    }

    this.createRevision(updatedDoc)

    updatedDoc.revision = updatedDoc.revision + 1
    updatedDoc.content = docRevision.content
    updatedDoc.contentState = docRevision.contentState

    updatedDoc = await this.getDocRepository().save(updatedDoc)

    await this.notifyActivity(DocActivity.updated(doc, updatedDoc, setup, actorId))

    return updatedDoc
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
    await this.notifyActivity(DocActivity.archived(doc))

    return doc
  }

  async restore(docId: number): Promise<Doc> {
    let doc = await this.requireById(docId, { withDeleted: true })
    this.verifyRestore(doc)

    doc = await this._restore(doc)

    await this.nodeContentMediator.contentRestored(docId, this.getNodeType())

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
    await this.notifyActivity(DocActivity.restored(doc))

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
    await this.notifyActivity(DocActivity.deleted(doc))
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
}
