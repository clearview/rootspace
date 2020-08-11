import { EntityRepository } from 'typeorm'
import { TaskList } from '../../entities/tasks/TaskList'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(TaskList)
export class TaskListRepository extends BaseRepository<TaskList> {
  getCompleteTaskList(id: number): Promise<TaskList> {
    const queryBuilder = this.createQueryBuilder('taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .where('taskList.id = :id', { id })
      .andWhere('task.deletedAt IS NULL')

    return queryBuilder.getOne()
  }

  getFullTaskList(id: number): Promise<TaskList> {
    const queryBuilder = this.createQueryBuilder('taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .where('taskList.id = :id', { id })

    return queryBuilder.getOne()
  }

  async findOneArchived(id: number): Promise<TaskList> {
    return this
      .createQueryBuilder('taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .where('taskList.id = :id', { id })
      .withDeleted()
      .getOne()
  }
}
