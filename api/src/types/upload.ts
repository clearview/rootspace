export enum UploadType {
  UserAvatar = 'userAvatar',
  SpaceLogo = 'spaceLogo',
  TaskAttachment = 'taskAttachment',
  DocContent = 'docContent',
}

export enum UploadEntity {
  User = 'User',
  Space = 'Space',
  Task = 'Task',
  Doc = 'Doc',
}

export interface IUploadImageSize {
  name: string
  width: number
  height?: number
}

export interface IUploadImageConfig {
  type: UploadType
  sizes: IUploadImageSize[]
}

export interface IUploadVersion {
  bucket: string
  key: string
  filename: string
}

export interface IUploadVersions {
  [key: string]: IUploadVersion
}

export interface IUploadImageSize {
  name: string
  width: number
  height?: number
}

export interface IUploadImageConfig {
  type: UploadType
  sizes: IUploadImageSize[]
}
