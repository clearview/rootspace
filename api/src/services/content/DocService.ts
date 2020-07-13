import { getCustomRepository, DeleteResult } from 'typeorm'
import { DocRepository } from '../../database/repositories/DocRepository'
import { Doc } from '../../database/entities/Doc'
import { DocCreateValue, DocUpdateValue } from '../../values/doc'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'

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
    return this.getDocRepository().findOneOrFail(id)
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

    return this.getDocRepository().reload(doc)
  }

  async update(data: DocUpdateValue, id: number): Promise<Doc> {
    let doc = await this.getById(id)

    Object.assign(doc, data.attributes)
    doc = await this.getDocRepository().save(doc)

    return this.getDocRepository().reload(doc)
  }

  async remove(id: number) {
    const doc = await this.getById(id)
    const removedDoc = await this.getDocRepository().remove(doc)

    this.mediator.contentRemoved(removedDoc.id, this.getNodeType())

    return removedDoc
  }

  async nodeDeleted(contentId: number): Promise<void> {
    await this.getDocRepository().delete({ id: contentId })
  }
}
