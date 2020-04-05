import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entities/User'

@EntityRepository(User)
export class UserRepository extends Repository<User> {

}