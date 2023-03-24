import { Brackets, EntityRepository } from 'typeorm'
import { Task } from '../../entities/tasks/Task'
import { BaseRepository } from '../BaseRepository'
import { Upload } from '../../entities/Upload'

@EntityRepository(Task)
export class TaskRepository extends BaseRepository<Task> {
  getById(id: number): Promise<Task> {
    return this.createQueryBuilder('task')
      .where('task.id = :id', { id })
      .leftJoinAndSelect('task.user', 'createdBy')
      .leftJoinAndMapOne(
        'createdBy.avatar',
        Upload,
        'avatar',
        `avatar.entityId = createdBy.id and avatar.entity = 'User'`
      )
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndMapOne(
        'assignee.avatar',
        Upload,
        'assigneeAvatar',
        `assigneeAvatar.entityId = assignee.id and assigneeAvatar.entity = 'User'`
      )
      .leftJoinAndMapMany(
        'task.attachments',
        Upload,
        'upload',
        'upload.entityId = task.id AND upload.entity = :entity',
        {
          entity: 'Task',
        }
      )
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndMapOne(
        'user.avatar',
        Upload,
        'commentAvatar',
        `commentAvatar.entityId = user.id and commentAvatar.entity = 'User'`
      )
      .getOne()
  }

  getByListId(listId: number, options: any = {}): Promise<Task[]> {
    const queryBuilder = this.createQueryBuilder('task').where('task.listId = :listId', { listId })

    if (options.withDeleted) {
      queryBuilder.withDeleted()
    }

    return queryBuilder.getMany()
  }

  async filterByTaskBoardId(taskBoardId: number, searchParam?: string, filterParam?: any): Promise<Task[]> {
    const searchQuery = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'createdBy')
      .leftJoinAndMapOne(
        'createdBy.avatar',
        Upload,
        'avatar',
        'avatar.entityId = createdBy.id AND avatar.entity = :avatarEntity',
        { avatarEntity: Upload.entities.User }
      )
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndMapOne(
        'assignee.avatar',
        Upload,
        'assigneeAvatar',
        'assigneeAvatar.entityId = assignee.id and assigneeAvatar.entity = :assigneeAvatarEntity',
        { assigneeAvatarEntity: Upload.entities.User }
      )
      .leftJoinAndMapMany(
        'task.attachments',
        Upload,
        'upload',
        'upload.entityId = task.id AND upload.entity = :entity',
        {
          entity: 'Task',
        }
      )
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndMapOne(
        'user.avatar',
        Upload,
        'commentAvatar',
        `commentAvatar.entityId = user.id and commentAvatar.entity = 'User'`
      )
      .innerJoin('task.list', 'taskList')
      .innerJoin('taskList.board', 'taskBoard')
      .where('taskBoard.id = :taskBoardId', { taskBoardId })
      .orderBy('comment.createdAt', 'DESC')
      .withDeleted()

    if (searchParam) {
      const search = searchParam.match(/\b(\w+)\b/g).join(' | ')

      searchQuery.andWhere(
        new Brackets((qb) => {
          qb.where('to_tsvector(task.title) @@ to_tsquery(:search)', { search })
            .orWhere('to_tsvector(task.description) @@ to_tsquery(:search)', { search })
            .orWhere('task.id IS NULL')
        })
      )
    }

    if (typeof filterParam?.status !== 'undefined' && filterParam?.status !== null) {
      searchQuery.andWhere('task.status = :status', {
        status: filterParam.status,
      })
    }

    if (filterParam?.unassigned) {
      searchQuery.andWhere('assignee IS NULL')
    } else if (filterParam?.assignees?.length > 0) {
      searchQuery.andWhere('assignee.id IN (:...assignees)', {
        assignees: filterParam.assignees,
      })
    }

    if (filterParam?.tags?.length > 0) {
      searchQuery.andWhere('tag.id IN (:...tags)', { tags: filterParam.tags })
    }

    if (typeof filterParam?.dueDate !== 'undefined') {
      searchQuery
        .andWhere('task.dueDate IS NOT null')
        .andWhere('task.dueDate >= :dueDateStart', {
          dueDateStart: filterParam.dueDate.start,
        })
        .andWhere('task.dueDate <= :dueDateEnd', {
          dueDateEnd: filterParam.dueDate.end,
        })
    }

    if (filterParam?.archived === true) {
      searchQuery.andWhere('task.deletedAt IS NOT NULL')
    } else {
      searchQuery.andWhere('task.deletedAt IS NULL')
    }

    return searchQuery.getMany()
  }

  async findOneArchived(id: number): Promise<Task> {
    return this.createQueryBuilder('task')
      .where('task.id = :id', { id })
      .withDeleted()
      .getOne()
  }
}
