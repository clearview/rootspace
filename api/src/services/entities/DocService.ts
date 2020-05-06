import { getCustomRepository } from 'typeorm'
import { DocRepository } from '../../repositories/DocRepository'
import { Doc } from '../../entities/Doc'
import { DocCreateValue, DocUpdateValue } from '../../values/doc'
import { ContentManager } from '../ContentManager'

export class DocService {
  protected contentManager: ContentManager

  constructor() {
    this.contentManager = new ContentManager()
  }

  getDocRepository(): DocRepository {
    return getCustomRepository(DocRepository)
  }

  getDocById(id: number): Promise<Doc> {
    return this.getDocRepository().findOne(id)
  }

  async create(data: DocCreateValue): Promise<Doc> {
    const doc = await this.getDocRepository().save(data.toObject())
    this.contentManager.docCreated(doc)

    return doc
  }

  async update(data: DocUpdateValue, id: number): Promise<any> {
    return await this.getDocRepository().update(id, data.toObject())
  }

  delete(id: number) {
    return getCustomRepository(DocRepository).delete({
      id,
    })
  }
}
