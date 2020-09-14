import { Brackets, EntityRepository } from 'typeorm'
import { Task } from '../../entities/tasks/Task'
import { BaseRepository } from '../BaseRepository'
import { Upload } from '../../entities/Upload'
import { UploadEntity } from '../../../types/upload'

@EntityRepository(Task)
export class TaskRepository extends BaseRepository<Task> {
  getById(id: number): Promise<Task> {
    return this.createQueryBuilder('task')
      .where('task.id = :id', { id })
      .leftJoinAndSelect('task.user', 'createdBy')
      .leftJoinAndMapOne('createdBy.avatar', Upload, 'avatar', 'avatar.entityId = createdBy.id and avatar.entity = \'User\'')
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndMapOne('assignee.avatar', Upload, 'assigneeAvatar', 'assigneeAvatar.entityId = assignee.id and assigneeAvatar.entity = \'User\'')
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
      .leftJoinAndMapOne('user.avatar', Upload, 'commentAvatar', 'commentAvatar.entityId = user.id and commentAvatar.entity = \'User\'')
      .getOne()
  }
  async filterByTaskBoardId(taskBoardId: number, searchParam?: string, filterParam?: any): Promise<Task[]> {
    const searchQuery = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'createdBy')
      .leftJoinAndMapOne(
        'createdBy.avatar',
        Upload,
        'avatar',
        'avatar.entityId = createdBy.id AND avatar.entity = :avatarEntity',
        { avatarEntity: UploadEntity.User }
      )
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndMapOne(
        'assignee.avatar',
        Upload,
        'assigneeAvatar',
        'assigneeAvatar.entityId = assignee.id and assigneeAvatar.entity = :assigneeAvatarEntity',
        { assigneeAvatarEntity: UploadEntity.User }
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
      .leftJoinAndMapOne('user.avatar', Upload, 'commentAvatar', 'commentAvatar.entityId = user.id and commentAvatar.entity = \'User\'')
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

    return searchQuery.getMany()
  }

  async findOneArchived(id: number): Promise<Task> {
    return this.createQueryBuilder('task')
      .where('task.id = :id', { id })
      .withDeleted()
      .getOne()
  }
}
