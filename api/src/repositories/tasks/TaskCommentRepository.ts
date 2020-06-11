import { EntityRepository, Repository } from 'typeorm'
import { Task } from '../../entities/tasks/Task'
import {TaskComment} from '../../entities/tasks/TaskComment'

@EntityRepository(TaskComment)
export class TaskCommentRepository extends Repository<Task> {}
