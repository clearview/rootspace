import { getCustomRepository, getManager, getConnection } from 'typeorm'
import { DocRepository } from '../repositories/DocRepository'
import { Doc } from '../entities/Doc'
import { Link } from '../entities/Link'
import { IDocCreateProvider, IDocUpdateProvider } from '../types/doc'
import { clientError } from '../errors/httpError'
import { ClientErrName, ClientStatusCode } from '../errors/httpErrorProperty'

export class DocService {
  getDocRepository(): DocRepository {
    return getCustomRepository(DocRepository)
  }

  getDocById(id: number): Promise<Doc> {
    return this.getDocRepository().findOne(id)
  }

  async create(data: IDocCreateProvider, userId: number): Promise<Doc> {
    let doc = this.getDocRepository().create({ userId, ...data })

    const conn = getConnection()
    const queryRunner = conn.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      doc = await queryRunner.manager.save(doc)

      const link = new Link()
      link.userId = userId
      link.spaceId = data.spaceId
      link.title = data.title
      link.type = 'doc'
      link.value = String(doc.id)

      await queryRunner.manager.save(link)
      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }

    return doc
  }

  async update(data: IDocUpdateProvider, id: number): Promise<any> {
    return await this.getDocRepository().update(id, data)
  }
}
