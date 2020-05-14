import { getCustomRepository, UpdateResult, DeleteResult } from 'typeorm'
import { DocRepository } from '../../repositories/DocRepository'
import { Doc } from '../../entities/Doc'
import { DocCreateValue, DocUpdateValue } from '../../values/doc'
import { Link } from '../../entities/Link'
import { LinkType } from '../../constants'
import { LinkCreateValue, LinkUpdateValue } from '../../values/link'
import { ILinkContent } from '../types'
import { ContentManager } from './ContentManager'
import { clientError } from '../../errors/httpError'

export class DocService implements ILinkContent<Doc> {
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
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

  getLinkByContent(doc: Doc): Promise<Link> {
    return this.contentManager.getLinkByValue(String(doc.id))
  }

  createLinkByContent(doc: Doc): Promise<Link> {
    const linkCreateData = LinkCreateValue.fromObject({
      userId: doc.userId,
      spaceId: doc.spaceId,
      title: doc.title,
      type: LinkType.Doc,
      value: String(doc.id),
    })

    return this.contentManager.createLinkByContent(linkCreateData)
  }

  async updateLinkByContent(doc: Doc): Promise<UpdateResult> {
    const link = await this.contentManager.getLinkByValue(String(doc.id))

    const updateLinkData = LinkUpdateValue.fromObject({
      title: doc.title,
    })

    return this.contentManager.updateLinkByContent(updateLinkData, link.id)
  }

  async deleteLinkByContent(doc: Doc): Promise<DeleteResult> {
    const link = await this.contentManager.getLinkByValue(String(doc.id))
    return this.contentManager.deleteLinkByContent(link.id)
  }

  getContentByLink(link: Link): Promise<Doc> {
    return this.getById(Number(link.value))
  }

  updateContentByLink(link: Link): Promise<UpdateResult> {
    const data = DocUpdateValue.fromObject({
      title: link.title,
    })

    return this.getDocRepository().update(Number(link.value), data.toObject())
  }

  deleteContentByLink(link: Link): Promise<DeleteResult> {
    return this.getDocRepository().delete(Number(link.value))
  }

  async getById(id: number): Promise<Doc> {
    return this.getDocRepository().findOne(id)
  }

  async create(data: DocCreateValue): Promise<Doc> {
    const doc = await this.getDocRepository().save(data.toObject())
    await this.createLinkByContent(doc)

    return doc
  }

  async update(data: DocUpdateValue, id: number): Promise<any> {
    let doc = await this.getById(id)

    if (!doc) {
      throw clientError('Error updating document')
    }

    const res = await this.getDocRepository().update(id, data.toObject())

    if (res.affected > 0) {
      doc = await this.getById(id)
      await this.updateLinkByContent(doc)
    }

    return res
  }

  async delete(id: number) {
    const doc = await this.getById(id)

    if (!doc) {
      throw clientError('Error deleting document')
    }

    const res = await this.getDocRepository().delete({
      id,
    })

    if (res.affected > 0) {
      await this.deleteLinkByContent(doc)
    }

    return res
  }
}
