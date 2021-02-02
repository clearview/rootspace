import { ActivityResource } from '@/types/resource'
import { Location } from 'vue-router'

export enum ActivityEntity {
  Doc = 'Doc',
  Embed = 'Embed',
  Folder = 'Folder',
  Link = 'Link',
  Task = 'Task',
  TaskBoard = 'TaskBoard',
}

export const ActivityRouteName: Record<ActivityEntity, string> = {
  [ActivityEntity.Doc]: 'Document',
  [ActivityEntity.Embed]: 'Embed',
  [ActivityEntity.Folder]: '',
  [ActivityEntity.Link]: 'Link',
  [ActivityEntity.Task]: 'TaskPageWithItem',
  [ActivityEntity.TaskBoard]: 'TaskPage'
}

export const getEntityLink = (data: ActivityResource): Location | string => {
  const name = ActivityRouteName[data.entity as ActivityEntity]
  const params: Record<string, string> = {}

  if (!(name && data.entityId)) return ''

  switch (data.entity) {
    case ActivityEntity.Task:
      params.id = data.context.entity.boardId.toString()
      params.item = data.entityId.toString()
      break

    default:
      params.id = data.entityId.toString()
  }

  return { name, params }
}
