import { getCustomRepository, getManager, getConnection } from 'typeorm'
import { LinkType } from '../constants'
import { DocRepository } from '../repositories/DocRepository'
import { Doc } from '../entities/Doc'
import { Link } from '../entities/Link'
import { IDocCreateProvider } from '../types/doc'

export class DocService {
  getDocRepository(): DocRepository {
    return getCustomRepository(DocRepository)
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
      link.type = LinkType.Doc
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
}
