export interface ITaskBoardCreateAttributes {
  userId: number
  spaceId: number
  listId: number
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
  assignedTo?: object
  title?: string
  description?: string
  status?: number
  tags?: object
  attachments?: object
  dueDate?: string
  order?: number
}