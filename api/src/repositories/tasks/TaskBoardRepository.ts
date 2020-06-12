import { EntityRepository } from 'typeorm'
import {BaseRepository} from '../BaseRepository'
import {TaskBoard} from '../../entities/tasks/TaskBoard'

@EntityRepository(TaskBoard)
export class TaskBoardRepository extends BaseRepository<TaskBoard> {}
