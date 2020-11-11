import { getConnection } from 'typeorm'
import { ucFirst } from '../utils'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'

export class EntityService {
  private static instance: EntityService

  private constructor() {}

  static getInstance() {
    if (!EntityService.instance) {
      EntityService.instance = new EntityService()
    }

    return EntityService.instance
  }

  getEntityByNameAndId<T>(name: string, id: number, options: any = {}): Promise<T | undefined> {
    name = this.convertEntityName(name)

    const queryBuilder = getConnection()
      .getRepository<T>(name)
      .createQueryBuilder('entity')
      .where('entity.id = :id', { id })

    if (options.withDeleted === true) {
      queryBuilder.withDeleted()
    }

    return queryBuilder.getOne()
  }

  async requireEntityByNameAndId<T>(name: string, id: number): Promise<T> {
    const entity = await this.getEntityByNameAndId<T>(name, id)

    if (!entity) {
      throw clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return entity
  }

  convertEntityName(name: string): string {
    switch (name) {
      case 'taskboard':
        return 'TaskBoard'

      case 'tasklist':
        return 'TaskList'

      default:
        return ucFirst(name)
    }
  }
}
