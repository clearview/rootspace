export type EmbedCreateAttributes = {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly type: string
  readonly content: string
  readonly parentId?: number
}

export type EmbedUpdateAttributes = Omit<Partial<EmbedCreateAttributes>, 'userId' | 'spaceId'>
