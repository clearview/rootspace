export interface IDocCreateProvider {
  spaceId: number
  title: string
  content: string
  access: number
}

export interface IDocUpdateProvider {
  title: string
  content: string
  access: number
}
