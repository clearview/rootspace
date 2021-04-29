export type QueryOptions = {
  addSelect?: string[]
  withDeleted?: boolean
  orderBy?: { sort: string; order?: 'ASC' | 'DESC' }
}
