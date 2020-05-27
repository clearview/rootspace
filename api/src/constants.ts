interface ILinkType {
  Root: string
  Link: string
  Doc: string
}

export const LinkType: ILinkType = {
  Root: 'root',
  Link: 'link',
  Doc: 'doc',
}

interface IDocAccess {
  Owner: number
  All: number
}

export const DocAccess: IDocAccess = {
  Owner: 1,
  All: 2,
}
