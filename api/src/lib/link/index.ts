import { Link } from '../../entities/Link'
import { Doc } from '../../entities/Doc'
import { LinkDoc } from './LinkDoc'

const linkContentHandler = {
  doc: (link: Link): Promise<Doc | Doc[]> => {
    return new LinkDoc().getData(link)
  },
}

export function getLinkContent(link: Link): Promise<object | object[] | null> {
  if (linkContentHandler.hasOwnProperty(link.type)) {
    return linkContentHandler[link.type](link)
  }

  return null
}
