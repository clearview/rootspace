import { getCustomRepository } from 'typeorm'
import { DocRepository } from '../repositories/DocRepository'
import { Doc } from '../entities/Doc'
import { DocCreateValue, DocUpdateValue } from '../values/doc'
import { ContentManager } from './content/ContentManager'
import { clientError } from '../errors/httpError'

export class DocService {
  private contentManager: ContentManager

  private constructor() {
    this.contentManager = ContentManager.getInstance()
  }

  private static instance: DocService

  static getInstance() {
    if (!DocService.instance) {
      DocService.instance = new DocService()
    }

    return DocService.instance
  }

  getDocRepository(): DocRepository {
    return getCustomRepository(DocRepository)
  }

  getDocById(id: number): Promise<Doc> {
    return this.getDocRepository().findOne(id)
  }

  async create(data: DocCreateValue): Promise<Doc> {
    const doc = await this.getDocRepository().save(data.toObject())
    await this.contentManager.docCreated(doc)
    return doc
  }

  async update(data: DocUpdateValue, id: number): Promise<any> {
    return await this.getDocRepository().update(id, data.toObject())
  }

  async delete(id: number) {
    const doc = await this.getDocById(id)

    if (!doc) {
      throw clientError('Error deleting document')
    }

    const res = await getCustomRepository(DocRepository).delete({
      id,
    })

    this.contentManager.docDeleted(doc)

    return res
  }
}
