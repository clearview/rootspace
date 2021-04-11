export enum NodeType {
  Undefined = 'undefined',
  Root = 'root',
  Archive = 'archive',
  Folder = 'folder',
  Link = 'link',
  Document = 'doc',
  Embed = 'embed',
  TaskBoard = 'taskBoard',
  Storage = 'storage',
}

export interface INodeConfig {
  novaDoc?: boolean
}
