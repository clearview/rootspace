import { getCustomRepository, DeleteResult } from 'typeorm'
import { DocRepository } from '../repositories/DocRepository'
import { Doc } from '../entities/Doc'
import { DocCreateValue, DocUpdateValue } from '../values/doc'
import { Link } from '../entities/Link'
import { LinkType } from '../constants'
import { LinkCreateValue, LinkUpdateValue } from '../values/link'
import { clientError, HttpErrName, HttpStatusCode } from '../errors'
import { LinkService } from './LinkService'
import { ILinkContent } from './types'

export class DocService implements ILinkContent<Doc> {
  private linkService: LinkService

  private constructor() {
    this.linkService = LinkService.getInstance()
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

  getLinkContent(link: Link): Promise<Doc> {
    return this.getById(Number(link.value))
  }

  getDocLink(doc: Doc): Promise<Link> {
    return this.linkService.getLinkByValue(String(doc.id))
  }

  getById(id: number): Promise<Doc> {
    return this.getDocRepository().findOne(id)
  }

  async requireDocById(id: number): Promise<Doc> {
    const doc = await this.getById(id)

    if (doc) {
      return doc
    }

    throw clientError(
      'Document not found',
      HttpErrName.EntityNotFound,
      HttpStatusCode.NotFound
    )
  }

  async create(data: DocCreateValue): Promise<Doc> {
    const doc = await this.getDocRepository().save(data.getAttributes())

    await this.linkService.create(
      LinkCreateValue.fromObject({
        userId: doc.userId,
        spaceId: doc.spaceId,
        title: doc.title,
        type: LinkType.Doc,
        value: String(doc.id),
      })
    )

    return doc
  }

  async update(data: DocUpdateValue, id: number): Promise<Doc> {
    let doc = await this.requireDocById(id)

    Object.assign(doc, data.getAttributes())
    doc = await this.getDocRepository().save(doc)

    const link = await this.linkService.getLinkByValue(String(doc.id))

    if (link) {
      await this.linkService.updateByContent(
        LinkUpdateValue.fromObject({
          title: doc.title,
        }),
        link.id
      )
    }

    return doc
  }

  async updateByLink(link: Link): Promise<Doc> {
    const doc = await this.requireDocById(Number(link.value))
    doc.title = link.title

    return this.getDocRepository().save(doc)
  }

  async delete(id: number) {
    const doc = await this.requireDocById(id)
    const res = await this.getDocRepository().delete({
      id,
    })

    if (res.affected > 0) {
      const link = await this.linkService.getLinkByValue(String(doc.id))
      await this.linkService.deleteByContent(link.id)
    }

    return res
  }

  async deleteByLink(link: Link): Promise<DeleteResult> {
    const id = Number(link.value)
    return this.getDocRepository().delete({ id })
  }
}
