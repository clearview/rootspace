export interface ITaskListCreateAttributes {
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

export interface ITaskListUpdateAttributes {
  assignedTo?: object
  title?: string
  description?: string
  status?: number
  tags?: object
  attachments?: object
  dueDate?: string
  order?: number
}