export interface IQueryOptions {
  addSelect?: string[]
  withDeleted?: boolean
  orderBy?: { sort: string; order?: 'ASC' | 'DESC' }
}
