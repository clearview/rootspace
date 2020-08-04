export interface ILinkCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly value: string
  readonly newTab: boolean
}

export type ILinkUpdateAttributes = Omit<
  Partial<ILinkCreateAttributes>,
  'userId' | 'spaceId'
>
