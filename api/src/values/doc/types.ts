import { IDocContent } from '../../types/doc'

export interface IDocCreateAttributes {
  userId: number
  spaceId: number
  title: string
  content: IDocContent
  access: number
  isLocked: boolean
  parentId?: number;
}

export type IDocUpdateAttributes = Omit<Partial<IDocCreateAttributes>, 'userId' | 'spaceId'>
