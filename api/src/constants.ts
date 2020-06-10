interface ILinkType {
  Root: string
  Link: string
  Doc: string
  TaskBoard: string
}

export const LinkType: ILinkType = {
  Root: 'root',
  Link: 'link',
  Doc: 'doc',
  TaskBoard: 'taskBoard'
}

interface IDocAccess {
  Owner: number
  All: number
}

export const DocAccess: IDocAccess = {
  Owner: 1,
  All: 2,
}
