import { EntityRepository, Repository } from 'typeorm'
import {TaskComment} from '../../entities/tasks/TaskComment'

@EntityRepository(TaskComment)
export class TaskCommentRepository extends Repository<TaskComment> {}
