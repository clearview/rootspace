import { IDocContent } from '../../types/doc'

export interface IDocCreateAttributes {
  userId: number
  spaceId: number
  title: string
  content: IDocContent
  access: number
  isLocked: boolean
}

export type IDocUpdateAttributes = Omit<Partial<IDocCreateAttributes>, 'userId' | 'spaceId'>
