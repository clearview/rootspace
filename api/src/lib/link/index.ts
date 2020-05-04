import { Link } from '../../entities/Link'
import { Doc } from '../../entities/Doc'
import { LinkDoc } from './LinkDoc'

interface ILinkType {
  Link: string
  Doc: string
}

export const LinkType: ILinkType = {
  Link: 'link',
  Doc: 'doc',
}

const linkContentMap = {
  doc: (link: Link): Promise<Doc | Doc[]> => {
    return new LinkDoc().getData(link)
  },
}

export function getLinkContent(link: Link): Promise<object | object[] | null> {
  if (linkContentMap.hasOwnProperty(link.type)) {
    return linkContentMap[link.type](link)
  }

  return null
}
