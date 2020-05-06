import { Doc } from '../../entities/Doc'
import { Link } from '../../entities/Link'
import { LinkCreateValue } from '../../values/link'
import { LinkService } from '../LinkService'
import { DocService } from '../DocService'

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

  linkDeleted(link: Link) {
    this.getDocService().delete(Number(link.value))
  }

  getDocLink(doc: Doc): Promise<Link> {
    return this.getLinkService().getLinkByValue(String(doc.id))
  }

  async docCreated(doc: Doc): Promise<boolean> {
    const data = LinkCreateValue.fromDoc(doc)
    await this.getLinkService().create(data)

    return true
  }

  async docDeleted(doc: Doc) {
    const link = await this.getLinkService().getLinkByValue(String(doc.id))

    if (link) {
      this.getLinkService().delete(link.id)
    }
  }

  private getDocService(): DocService {
    if (!this.services.docService) {
      this.services.docService = DocService.getInstance()
    }

    return this.services.docService
  }

  private getLinkService(): LinkService {
    if (!this.services.linkService) {
      this.services.linkService = LinkService.getInstance()
    }

    return this.services.linkService
  }
}
