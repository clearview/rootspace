import { Repository } from 'typeorm'

interface WithId { id: number }

export abstract class BaseRepository<T> extends Repository<T> {
    public reload<ET extends WithId>(entity: ET): Promise<ET> {
        return this.findOneOrFail(entity.id) as any
    }
}
