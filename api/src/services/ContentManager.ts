import { Doc } from '../entities/Doc'
import { Link } from '../entities/Link'
import { getLinkContent } from '../lib/link'
import { LinkCreateValue } from '../values/link/LinkCreateValue'
import { LinkService } from './entities/LinkService'

export class ContentManager {
  private linkService: LinkService

  constructor() {
    this.linkService = new LinkService()
  }

  getLinkContent(link: Link): Promise<object | object[] | null> {
    return getLinkContent(link)
  }

  async docCreated(doc: Doc): Promise<boolean> {
    const data = new LinkCreateValue(
      doc.userId,
      doc.spaceId,
      doc.title,
      'doc',
      String(doc.id)
    )

    await this.linkService.create(data)
    return true
  }
}
