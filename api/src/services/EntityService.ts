import { getConnection } from 'typeorm'
import { ucFirst } from '../utils'
import { clientError, HttpErrName, HttpStatusCode } from '../errors'

export class EntityService {
  private static instance: EntityService

  private constructor() {}

  static getInstance() {
    if (!EntityService.instance) {
      EntityService.instance = new EntityService()
    }

    return EntityService.instance
  }

  getEntityByNameAndId(name: string, id: number): Promise<any | undefined> {
    name = this.convertEntityName(name)

    return getConnection()
      .getRepository(name)
      .createQueryBuilder('entity')
      .where('entity.id = :id', { id })
      .getOne()
  }

  async requireEntityByNameAndId(name: string, id: number): Promise<any> {
    const entity = await this.getEntityByNameAndId(name, id)

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
