import { MigrationInterface, QueryRunner } from 'typeorm'

export class DocsContentUpdatedBy1602881453480 implements MigrationInterface {
  name = 'DocsContentUpdatedBy1602881453480'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" ADD COLUMN "contentUpdatedBy" INTEGER`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" DROP COLUMN "contentUpdatedBy"`)
  }
}
