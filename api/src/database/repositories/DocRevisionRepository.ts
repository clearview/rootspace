import { EntityRepository } from 'typeorm'
import { User } from '../entities/User'
import { BaseRepository } from './BaseRepository'
import { DocRevision } from '../entities/DocRevision'
import { Upload } from '../entities/Upload'

@EntityRepository(DocRevision)
export class DocRevisionRepository extends BaseRepository<DocRevision> {
  getByDocId(docId: number): Promise<DocRevision[]> {
    return this.createQueryBuilder('docRevision')
      .where('docRevision.docId = :docId', { docId })
      .leftJoinAndMapOne('docRevision.revisionUser', User, 'revisionUser', 'docRevision.revisionBy = revisionUser.id')
      .leftJoinAndMapOne(
        'revisionUser.avatar',
        Upload,
        'avatar',
        'avatar.entityId = revisionUser.id AND avatar.entity = :avatarEntity',
        { avatarEntity: Upload.entities.User }
      )
      .orderBy('docRevision.revisionAt', 'DESC')
      .getMany()
  }
}
