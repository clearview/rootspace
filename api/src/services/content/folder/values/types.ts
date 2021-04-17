export interface FolderCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly parentId?: number
}

export type FolderUpdateAttributes = Omit<Partial<FolderCreateAttributes>, 'userId' | 'spaceId'>
