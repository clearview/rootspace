import {EntityRepository, Repository} from 'typeorm'
import {Space} from '../entities/Space'

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {

}