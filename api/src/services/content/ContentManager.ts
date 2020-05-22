import { UpdateResult, DeleteResult } from 'typeorm'
import { Link } from '../../entities/Link'
import { Space } from '../../entities/Space'
import { LinkCreateValue, LinkUpdateValue } from '../../values/link'
import { LinkService } from '../LinkService'
import { DocService } from './DocService'
import { ILinkContent } from '../types'
import { LinkType } from '../../constants'

export class ContentManager {
  private services = {
    link: null,
    doc: null,
  }

  private linkTypeContentService = {
    doc: () => {
      return this.getDocService()
    },
  }

  private constructor() {}

  static instance = null

  static getInstance() {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager()
    }

    return ContentManager.instance
  }

  getLinkByValue(value: string): Promise<Link> {
    return this.getLinkService().getLinkByValue(value)
  }

  createSpaceRootLink(space: Space): Promise<Link> {
    const data = LinkCreateValue.fromObject({
      spaceId: space.id,
      userId: space.userId,
      title: 'root',
      type: LinkType.Root,
      value: String(space.id),
    })

    return this.getLinkService().createSpaceRoot(data)
  }

  createLinkByContent(data: LinkCreateValue): Promise<Link> {
    return this.getLinkService().create(data)
  }

  updateLinkByContent(
    data: LinkUpdateValue,
    id: number
  ): Promise<UpdateResult> {
    return this.getLinkService().updateByContent(data, id)
  }

  deleteLinkByContent(id: number): Promise<DeleteResult> {
    return this.getLinkService().deleteByContent(id)
  }

  getContentByLink(link: Link): Promise<object | object[] | null> {
    const service = this.getLinkContentService(link.type)

    if (!service) {
      return null
    }

    return service.getContentByLink(link)
  }

  updateContentByLink(link: Link): Promise<UpdateResult> {
    const service = this.getLinkContentService(link.type)

    if (!service) {
      return null
    }

    return service.updateContentByLink(link)
  }

  deleteContentByLink(link: Link): Promise<DeleteResult> {
    const service = this.getLinkContentService(link.type)

    if (!service) {
      return null
    }

    return service.deleteContentByLink(link)
  }

  private getLinkService(): LinkService {
    if (!this.services.link) {
      this.services.link = LinkService.getInstance()
    }

    return this.services.link
  }

  private getLinkContentService(linkType: string): ILinkContent<object> {
    if (this.linkTypeContentService.hasOwnProperty(linkType)) {
      const service = this.linkTypeContentService[linkType]()
      return service
    }

    return null
  }

  private getDocService(): DocService {
    if (!this.services.doc) {
      this.services.doc = DocService.getInstance()
    }

    return this.services.doc
  }
}
