export type QueryOptions = {
  offset?: number
  limit?: number
  orderBy?: { sort: string; order?: 'ASC' | 'DESC' }
  addSelect?: string[]
  withDeleted?: boolean
}
