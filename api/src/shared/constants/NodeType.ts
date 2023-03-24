import { ContentEntityName } from './ContentEntityName'

export const NodeContentType = {
  Folder: 'folder',
  Link: 'link',
  Doc: 'doc',
  Embed: 'embed',
  Storage: 'storage',
  TaskBoard: 'taskBoard',
}
export const NodeType = {
  Root: 'root',
  Archive: 'archive',
  Private: 'private',
  ...NodeContentType,
}

export const NodeTypeEntityNameMap = new Map<string, string>([
  [NodeType.Folder, ContentEntityName.Folder],
  [NodeType.Link, ContentEntityName.Link],
  [NodeType.Doc, ContentEntityName.Doc],
  [NodeType.Embed, ContentEntityName.Embed],
  [NodeType.Storage, ContentEntityName.Storage],
  [NodeType.TaskBoard, ContentEntityName.TaskBoard],
])
