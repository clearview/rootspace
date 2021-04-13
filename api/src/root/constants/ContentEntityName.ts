export const ContentEntityName = {
  Folder: 'Folder',
  Link: 'Link',
  Doc: 'Doc',
  Embed: 'Embed',
  Storage: 'Storage',
  TaskBoard: 'TaskBoard',
  TaskList: 'TaskList',
  Task: 'Task',
}

export const ContentEntityNames = new Set<string>(Object.keys(ContentEntityName))
