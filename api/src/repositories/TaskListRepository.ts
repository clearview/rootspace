import { EntityRepository, Repository } from 'typeorm'
import { TaskList } from '../entities/TaskList'

@EntityRepository(TaskList)
export class TaskListRepository extends Repository<TaskList> {}
