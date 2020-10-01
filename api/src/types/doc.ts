export enum DocAccess {
  Owner = 1,
  All = 2,
}

export interface IDocContent {
  time?: number
  blocks?: any[]
  vertsion?: string
}
