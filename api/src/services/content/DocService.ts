import { getCustomRepository, DeleteResult } from 'typeorm'
import { DocRepository } from '../../database/repositories/DocRepository'
import { Doc } from '../../database/entities/Doc'
import { DocCreateValue, DocUpdateValue } from '../../values/doc'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'

export class DocService extends NodeContentService {
  private nodeService: NodeService

  private constructor() {
    super()
    this.nodeService = NodeService.getInstance()
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

  async getById(id: number): Promise<Doc> {
    return this.getDocRepository().findOne(id)
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

    return doc
  }

  async update(data: DocUpdateValue, id: number): Promise<Doc> {
    let doc = await this.getById(id)

    if (!doc) {
      throw clientError('Error updating document')
    }

    Object.assign(doc, data.attributes)
    doc = await this.getDocRepository().save(doc)

    return doc
  }

  async delete(id: number) {
    const doc = await this.getById(id)

    if (!doc) {
      throw clientError(
        'Error deleting doc',
        HttpErrName.EntityNotFound,
        HttpStatusCode.NotFound
      )
    }

    if (!doc) {
      throw clientError('Error deleting document')
    }

    const res = await this.getDocRepository().delete({ id })

    if (res.affected > 0) {
      this.mediator.contentDeleted(doc.id, this.getNodeType())
    }

    return res
  }

  async nodeDeleted(contentId: number): Promise<void> {
    await this.getDocRepository().delete({ id: contentId })
  }
}
