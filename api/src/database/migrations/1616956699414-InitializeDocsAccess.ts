import { MigrationInterface, QueryRunner } from 'typeorm'
import { ContentAccess } from '../entities/ContentAccess'
import { Doc } from '../entities/Doc'
import { ContentEntityName } from '../../types/content'
import { ContentAccessType } from '../../components/content-access/ContentAccessType'
import { ContentAccessRepository } from '../repositories/ContentAccessRepository'

export class InitializeDocsAccess1616956699414 implements MigrationInterface {
  name = 'InitializeDocsAccess1616956699414'
  public async up(queryRunner: QueryRunner): Promise<void> {
    const docs = await queryRunner.manager.find(Doc)

    for (const doc of docs) {
      let contentAccess = await queryRunner.manager
        .getCustomRepository(ContentAccessRepository)
        .createQueryBuilder('contentAccess')
        .where('contentAccess.entityId = :entityId AND contentAccess.entity = :entity', {
          entityId: doc.id,
          entity: ContentEntityName.Doc,
        })
        .getOne()

      if (contentAccess) {
        continue
      }

      contentAccess = new ContentAccess()
      contentAccess.spaceId = doc.spaceId
      contentAccess.ownerId = doc.userId
      contentAccess.entityId = doc.id
      contentAccess.entity = ContentEntityName.Doc
      contentAccess.type = ContentAccessType.Open
      contentAccess.public = false

      await queryRunner.manager.save(contentAccess)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getCustomRepository(ContentAccessRepository).delete({
      entity: ContentEntityName.Doc,
    })
  }
}
