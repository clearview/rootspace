import { TaskBoardType} from '../../../entities/tasks/TaskBoard'

export interface ITaskBoardCreateAttributes {
  userId: number
  spaceId: number
  type: TaskBoardType
  assignedTo: object
  title: string
  description: string
  status: number
  tags: object
  attachments: object
  dueDate: string
  order: number
}

export interface ITaskBoardUpdateAttributes {
  type?: TaskBoardType,
  assignedTo?: object
  title?: string
  description?: string
  status?: number
  tags?: object
  attachments?: object
  dueDate?: string
  order?: number
}