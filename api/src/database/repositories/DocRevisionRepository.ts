import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { DocRevision } from '../entities/DocRevision'
import { Upload } from '../entities/Upload'
import { UploadEntity } from '../../types/upload'

@EntityRepository(DocRevision)
export class DocRevisionRepository extends BaseRepository<DocRevision> {
  getByDocId(docId: number): Promise<DocRevision[]> {
    return this.createQueryBuilder('docRevision')
      .where('docRevision.docId = :docId', { docId })
      .leftJoinAndSelect('docRevision.user', 'user')
      .leftJoinAndMapOne(
        'user.avatar',
        Upload,
        'avatar',
        'avatar.entityId = user.id AND avatar.entity = :avatarEntity',
        { avatarEntity: UploadEntity.User }
      )
      .orderBy('docRevision.revisionAt', 'DESC')
      .getMany()
  }
}
