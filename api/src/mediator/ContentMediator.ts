import { LinkService } from '../services/LinkService'
import { DocService } from '../services/DocService'
import { Link } from '../entities/Link'
import { getLinkContent } from '../lib/link'

export class ContentMediator {
  private linkService: LinkService
  private docService: DocService

  getLinkContent(link: Link): Promise<object | object[] | null> {
    return getLinkContent(link)
  }
}
