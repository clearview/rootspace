export type StorageCreateAttributes = {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly parentId?: number
}

export type StorageUpdateAttributes = Omit<Partial<StorageCreateAttributes>, 'userId' | 'spaceId'>
