import {Connection} from 'typeorm'
import {Factory, Seeder} from 'typeorm-seeding'
import {Link, LinkType} from '../../entities/Link'
import {BaseSeeder} from './base'
import {TaskBoard} from '../../entities/tasks/TaskBoard'
import {TaskList} from '../../entities/tasks/TaskList'
import {Task} from '../../entities/tasks/Task'
import {TaskComment} from '../../entities/tasks/TaskComment'
import * as faker from 'faker'

export default class TasksSeeder implements Seeder {
    protected base: BaseSeeder

    public async run(factory: Factory, connection: Connection): Promise<any> {
        this.base = await new BaseSeeder().run(factory)

        const taskBoards = await this.createTaskBoard(3)

        for (const taskBoard of taskBoards) {
            const taskLists = await this.createTaskList(taskBoard, 3)

            for (const taskList of taskLists) {
                const tasks = await this.createTasks(taskList, 3)

                for (const task of tasks) {
                    await this.createTaskComments(task, faker.random.number(3))
                }

            }
        }
    }

    async createTaskBoard(count: number): Promise<TaskBoard[]> {
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
                position: await this.base.linkService.getNodeNextPosition(this.base.rootLink.id)
            })
        }

        return taskBoards
    }

    async createTaskList(taskBoard: TaskBoard, count: number): Promise<TaskList[]> {
        return this.base.factory(TaskList)()
            .map(async (list: TaskList) => {
                list.userId = this.base.user.id
                list.spaceId = this.base.space.id
                list.boardId = taskBoard.id
                return list
            })
            .createMany(count)
    }

    async createTasks(taskList: TaskList, count: number): Promise<Task[]> {
        return this.base.factory(Task)()
            .map(async (task: Task) => {
                task.userId = this.base.user.id
                task.spaceId = this.base.space.id
                task.listId = taskList.id
                return task
            })
            .createMany(count)
    }

    async createTaskComments(task: Task, count: number): Promise<TaskComment[]> {
        return this.base.factory(TaskComment)()
            .map(async (taskComment: TaskComment) => {
                taskComment.userId = this.base.user.id
                taskComment.taskId = task.id
                return taskComment
            })
            .createMany(count)
    }
}