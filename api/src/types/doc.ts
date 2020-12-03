export enum DocAccess {
  Owner = 1,
  All = 2,
}

export interface IDocContent {
  time?: number
  blocks?: any[]
  vertsion?: string
}

export interface INovaDocContent {
  type: string
  content: object[]
}

export interface IDocUpdateSetup {
  contentUpdated: boolean
  updatedAttributes: string[]
  createRevision: boolean
  registerActivity: boolean
}
