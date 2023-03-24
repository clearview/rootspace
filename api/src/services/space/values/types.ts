export type SpaceCreateAttributes = {
  userId: number
  title: string
}

export type SpaceUpdateAttributes = Omit<Partial<SpaceCreateAttributes>, 'userId'>
