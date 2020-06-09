import { EntityRepository, Repository } from 'typeorm'
import { Task } from '../entities/Task'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getMaxPositionByListId(listId: number): Promise<number> {
        return this.createQueryBuilder('task')
            .where('task.listId = :listId', { listId })
            .getCount()
    }

}
