import { EntityRepository } from 'typeorm'
import { TaskList } from '../../entities/tasks/TaskList'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(TaskList)
export class TaskListRepository extends BaseRepository<TaskList> {
  getCompleteTasklist(id: number): Promise<TaskList | undefined> {
    const queryBuilder = this.createQueryBuilder('taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .where('taskList.id = :id', { id })
      .andWhere('task.deletedAt IS NULL')

    return queryBuilder.getOne()
  }
}
