export interface IStorageCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly parentId?: number
}

export type IStorageUpdateAttributes = Omit<Partial<IStorageCreateAttributes>, 'userId' | 'spaceId'>
