import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { TaskBoard } from '../../database/entities/tasks/TaskBoard'

@EntityRepository(TaskBoard)
export class TaskBoardRepository extends BaseRepository<TaskBoard> {}
