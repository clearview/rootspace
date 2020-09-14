import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { DocRevision } from '../entities/DocRevision'

@EntityRepository(DocRevision)
export class DocRevisionRepository extends BaseRepository<DocRevision> {
  getByDocId(docId: number): Promise<DocRevision[]> {
    return this.createQueryBuilder('docRevision')
      .where('docRevision.docId = :docId', { docId })
      .orderBy('docRevision.revisionAt', 'DESC')
      .getMany()
  }
}
