import { FindOptionsWhere, Repository } from 'typeorm'

interface WithId { id: number }

export abstract class BaseRepository<T extends WithId> extends Repository<T> {
    public reload(entity: T): Promise<T> {
        return this.findOneByOrFail({id:entity.id} as FindOptionsWhere<T>) as any
    }
}
