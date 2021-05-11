export type DocCreateAttributes = {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly content: object
  readonly contentState: number[]
  readonly access: number
  readonly isLocked: boolean
  readonly parentId?: number
}

export type DocUpdateAttributes = Omit<Partial<DocCreateAttributes>, 'userId' | 'spaceId'>
