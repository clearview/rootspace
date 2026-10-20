import { Connection } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'
import { User } from '../../entities/User'

export class DevSeeder implements Seeder {
  public factory: Factory
  public user: User

  private demoUserData = {
        firstName: 'Root',
        lastName: 'Space',
        email: 'rootspace@example.com',
        password: '$2a$16$hM3EoLYubAYokIL4odHn9uygGVmZuXzCA0L084M3FCH5EE56AD.8K' // rootspace
  }

  public async run(factory: Factory, connection: Connection): Promise<any> {
    this.factory = factory
    const userCount = await connection.manager.count(User, {where:{ email: this.demoUserData.email}})
    if (userCount===0){
      await this.createUser()
    }
  }

  private async createUser() {
    return this.factory(User)().create(this.demoUserData)
  }
}
