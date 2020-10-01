export interface ILinkCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly value: string
  readonly newTab: boolean
  readonly parentId?: number
}

export type ILinkUpdateAttributes = Omit<
  Partial<ILinkCreateAttributes>,
  'userId' | 'spaceId'
>
