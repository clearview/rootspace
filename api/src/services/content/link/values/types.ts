export interface LinkCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly value: string
  readonly newTab: boolean
  readonly parentId?: number
}

export type LinkUpdateAttributes = Omit<Partial<LinkCreateAttributes>, 'userId' | 'spaceId'>
