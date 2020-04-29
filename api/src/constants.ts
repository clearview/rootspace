export enum LinkType {
  Link = 'link',
  Doc = 'doc',
}

export const LINK_TYPE = {
  LINK: {
    route: null,
  },
  DOC: {
    route: '/docs/view/:id',
  },
}
