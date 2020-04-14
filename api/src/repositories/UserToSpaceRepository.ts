import { EntityRepository, Repository, Entity } from 'typeorm'
import { UserToSpace } from '../entities/UserToSpace'

@EntityRepository(UserToSpace)
export class UserToSpaceRepository extends Repository<UserToSpace> {

}
