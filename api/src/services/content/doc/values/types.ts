export type DocCreateAttributes = {
  userId: number
  spaceId: number
  title: string
  content: object
  contentState: number[]
  access: number
  isLocked: boolean
  parentId?: number
}

export type DocUpdateAttributes = Omit<Partial<DocCreateAttributes>, 'userId' | 'spaceId'>
