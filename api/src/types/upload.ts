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
  path: string
  key: string
}

export interface IUploadVersions {
  [key: string]: IUploadVersion
}

export const UploadUniqueTypes = [UploadType.UserAvatar, UploadType.SpaceLogo]

export interface IUploadImageSize {
  name: string
  width: number
  height?: number
}

export interface IUploadImageConfig {
  type: UploadType
  sizes: IUploadImageSize[]
}

export const UploadImageConfig: IUploadImageConfig[] = [
  {
    type: UploadType.UserAvatar,
    sizes: [
      {
        name: 'small',
        width: 28,
        height: 28,
      },
      {
        name: 'medium',
        width: 96,
        height: 96,
      },
    ],
  },
  {
    type: UploadType.TaskAttachment,
    sizes: [
      {
        name: 'small',
        width: 80,
        height: 64,
      },
      {
        name: 'preview',
        width: 1024,
        height: null,
      },
    ],
  },
]
