import { EntityRepository } from 'typeorm'
import { TaskList } from '../../entities/tasks/TaskList'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(TaskList)
export class TaskListRepository extends BaseRepository<TaskList> {

    async getMaxPositionByBoardId(boardId: number): Promise<number> {
        return this.createQueryBuilder('taskList')
            .where('taskList.boardId = :boardId', { boardId })
            .getCount()
    }

}
