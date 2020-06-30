import { EntityRepository } from 'typeorm'
import { Task } from '../../entities/tasks/Task'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(Task)
export class TaskRepository extends BaseRepository<Task> {

    async getMaxPositionByListId(listId: number): Promise<number> {
        return this.createQueryBuilder('task')
            .where('task.listId = :listId', { listId })
            .getCount()
    }

}
