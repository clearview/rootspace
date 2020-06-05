import {Connection} from 'typeorm'
import {Factory, Seeder} from 'typeorm-seeding'
import {Link, LinkType} from '../../entities/Link'
import {TaskBoard} from '../../entities/TaskBoard'
import {BaseSeeder} from './base'

export default class TasksSeeder implements Seeder {
    protected base: BaseSeeder

    public async run(factory: Factory, connection: Connection): Promise<any> {
        this.base = await new BaseSeeder().run(factory)

        const taskBoard = await this.createTaskBoard()
    }

    async createTaskBoard() {
        const taskBoard = await this.base.factory(TaskBoard)()
            .map(async (board: TaskBoard) => {
                board.userId = this.base.user.id
                board.spaceId = this.base.space.id
                return board
            })
            .create()

        await this.base.factory(Link)().create({
            parent: this.base.rootLink,
            userId: this.base.user.id,
            spaceId: this.base.space.id,
            type: LinkType.TaskBoard,
            title: taskBoard.title,
            value: String(taskBoard.id),
            position: await this.base.linkService.getLinkNextPositionByParentId(this.base.rootLink.id)
        })

        return taskBoard
    }
}