export interface IFolderCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly parentId?: number
}

export type IFolderUpdateAttributes = Omit<Partial<IFolderCreateAttributes>, 'userId' | 'spaceId'>
