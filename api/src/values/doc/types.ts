export interface IDocCreateAttributes {
  userId: number
  spaceId: number
  title: string
  content: object
  contentState: number[]
  access: number
  isLocked: boolean
  parentId?: number
}

export type IDocUpdateAttributes = Omit<Partial<IDocCreateAttributes>, 'userId' | 'spaceId'>
