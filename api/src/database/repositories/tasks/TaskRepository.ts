import { Brackets, EntityRepository } from 'typeorm'
import { Task } from '../../entities/tasks/Task'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(Task)
export class TaskRepository extends BaseRepository<Task> {
  async filterByTaskboardId(taskBoardId: number, searchParam?: string, filterParam?: any): Promise<Task[]> {
    const searchQuery = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .innerJoin('task.list', 'taskList')
      .innerJoin('taskList.board', 'taskBoard')
      .where('taskBoard.id = :taskBoardId', { taskBoardId })
      .andWhere('task.deletedAt IS NULL')
      .orderBy('comment.createdAt', 'DESC')

    if (searchParam) {
      searchQuery.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(task.title) LIKE :searchParam', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          })
            .orWhere('LOWER(task.description) LIKE :searchParam', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('task.id IS NULL')
        })
      )
    }

    if (typeof filterParam?.status !== 'undefined' && filterParam?.status !== null) {
      searchQuery.andWhere('task.status = :status', {
        status: filterParam.status,
      })
    }

    if(filterParam?.unassigned){
      searchQuery.andWhere('assignee IS NULL')
    }
    else if (filterParam?.assignees?.length > 0) {
      searchQuery.andWhere('assignee.id IN (:...assignees)', {
        assignees: filterParam.assignees,
      })
    }

    if (filterParam?.tags?.length > 0) {
      searchQuery.andWhere('tag.id IN (:...tags)', { tags: filterParam.tags })
    }

    return searchQuery.getMany()
  }
}
