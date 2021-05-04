import { MigrationInterface, QueryRunner } from 'typeorm'
import { Doc } from '../entities/Doc'
import { publicId } from '../../root/helpers'

export class DocsUpdatePublicId1619910693969 implements MigrationInterface {
  name = 'DocsUpdatePublicId1619910693969'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const docs = await queryRunner.manager
      .createQueryBuilder(Doc, 'doc')
      .select(['doc.id'])
      .where('doc.publicId IS NULL')
      .getMany()

    for (const doc of docs) {
      await queryRunner.manager
        .createQueryBuilder()
        .update('docs', {
          publicId: publicId(),
        })
        .where('id = :id', { id: doc.id })
        .execute()
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
