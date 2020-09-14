import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { DocRevision } from '../entities/DocRevision'

@EntityRepository(DocRevision)
export class DocRevisionRepository extends BaseRepository<DocRevision> {
  getLastRevisionByDocId(docId: number): Promise<DocRevision | undefined> {
    return this.createQueryBuilder('docRevision')
      .where('docRevision.docId = :docId', { docId })
      .orderBy('docRevision.createdAt', 'DESC')
      .getOne()
  }
}
