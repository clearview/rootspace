import {Connection} from 'typeorm'
import {Factory, Seeder} from 'typeorm-seeding'
import {Link, LinkType} from '../../entities/Link'
import {BaseSeeder} from './base'
import {TaskBoard} from '../../entities/TaskBoard'
import {TaskList} from '../../entities/TaskList'
import {Task} from '../../entities/Task'

export default class TasksSeeder implements Seeder {
    protected base: BaseSeeder

    public async run(factory: Factory, connection: Connection): Promise<any> {
        this.base = await new BaseSeeder().run(factory)

        const taskBoards = await this.createTaskBoard(3)

        for (const taskBoard of taskBoards) {
            const taskLists = await this.createTaskList(taskBoard, 3)

            for (const taskList of taskLists) {
                await this.createTasks(taskList, 3)
            }
        }
    }

    async createTaskBoard(count: number) {
        const taskBoards = await this.base.factory(TaskBoard)()
            .map(async (board: TaskBoard) => {
                board.userId = this.base.user.id
                board.spaceId = this.base.space.id
                return board
            })
            .createMany(count)

        for (const taskBoard of taskBoards) {
            await this.base.factory(Link)().create({
                parent: this.base.rootLink,
                userId: this.base.user.id,
                spaceId: this.base.space.id,
                type: LinkType.TaskBoard,
                title: taskBoard.title,
                value: String(taskBoard.id),
                position: await this.base.linkService.getLinkNextPositionByParentId(this.base.rootLink.id)
            })
        }

        return taskBoards
    }

    async createTaskList(taskBoard: TaskBoard, count: number) {
        return this.base.factory(TaskList)()
            .map(async (list: TaskList) => {
                list.userId = this.base.user.id
                list.spaceId = this.base.space.id
                list.boardId = taskBoard.id
                return list
            })
            .createMany(count)
    }

    async createTasks(taskList: TaskList, count: number) {
        return this.base.factory(Task)()
            .map(async (task: Task) => {
                task.userId = this.base.user.id
                task.spaceId = this.base.space.id
                task.listId = taskList.id
                return task
            })
            .createMany(count)
    }
}