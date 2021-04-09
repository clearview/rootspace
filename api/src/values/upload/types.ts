export interface IUploadCreateAttributes {
  readonly userId: number
  readonly filename: string
}

export type IUploadUpdateAttributes = Omit<Partial<IUploadCreateAttributes>, 'userId' | 'filename'>
