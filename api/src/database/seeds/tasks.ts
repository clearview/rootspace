import { Connection } from 'typeorm'
import { Seeder, Factory } from 'typeorm-seeding'
import { Link } from '../../entities/Link'
import { TaskBoard } from '../../entities/TaskBoard'
import { BaseSeeder } from './base'

export default class TasksSeeder implements Seeder {
    protected base: BaseSeeder

    public async run(factory: Factory, connection: Connection): Promise<any> {
        this.base = await new BaseSeeder().run(factory)

        const taskBoard = await this.createTaskBoard(this.base.rootLink)
    }

    async createTaskBoard(parentLink: Link) {
        const taskBoard = await this.base.factory(TaskBoard)().create()

        await this.base.factory(Link)().create({
            parent: parentLink,
            userId: this.base.user.id,
            spaceId: this.base.space.id,
            value: String(taskBoard.id),
            position: await this.base.linkService.getLinkNextPositionByParentId(parentLink.id)
        })

        return taskBoard
    }
}