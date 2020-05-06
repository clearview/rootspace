import { Doc } from '../entities/Doc'
import { Link } from '../entities/Link'
import { LinkCreateValue } from '../values/link/LinkCreateValue'
import { LinkService } from './entities/LinkService'
import { DocService } from './entities/DocService'

export class ContentManager {
  private services = {
    linkService: null,
    docService: null,
  }

  readonly linkContentHandler = {
    doc: (link: Link): Promise<Doc | Doc[]> => {
      return this.getLinkDoc(link)
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

  getLinkContent(link: Link): Promise<object | object[]> {
    if (this.linkContentHandler.hasOwnProperty(link.type)) {
      return this.linkContentHandler[link.type](link)
    }

    return null
  }

  getLinkDoc(link: Link) {
    return this.getDocService().getDocById(Number(link.value))
  }

  getDocLink(doc: Doc): Promise<Link> {
    return this.getLinkService().getLinkByValue(String(doc.id))
  }

  async docCreated(doc: Doc): Promise<boolean> {
    const data = new LinkCreateValue(
      doc.userId,
      doc.spaceId,
      doc.title,
      'doc',
      String(doc.id)
    )

    await this.getLinkService().create(data)
    return true
  }

  private getDocService() {
    if (!this.services.docService) {
      this.services.docService = DocService.getInstance()
    }

    return this.services.docService
  }

  private getLinkService() {
    if (!this.services.linkService) {
      this.services.linkService = new LinkService()
    }

    return this.services.linkService
  }
}
