import { Link } from '../../entities/Link'
import { Doc } from '../../entities/Doc'
import { DocService } from '../../services/entities/DocService'
import { LinkContent, ILinkContent } from './LinkContent'

export class LinkDoc extends LinkContent<Doc> implements ILinkContent<Doc> {
  getData(link: Link): Promise<Doc | Doc[]> {
    return new DocService().getDocById(Number(link.value))
  }
}
