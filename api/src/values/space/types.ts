export interface ISpaceCreateAttributes {
  userId: number
  title: string
}

export type ISpaceUpdateAttributes = Omit<
  Partial<ISpaceCreateAttributes>,
  'userId'
>
