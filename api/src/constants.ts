interface ILinkType {
  Root: string
  Link: string
  Doc: string
  Task: string
}

export const LinkType: ILinkType = {
  Root: 'root',
  Link: 'link',
  Doc: 'doc',
  Task: 'task'
}

interface IDocAccess {
  Owner: number
  All: number
}

export const DocAccess: IDocAccess = {
  Owner: 1,
  All: 2,
}
