import { MigrationInterface, QueryRunner } from 'typeorm'

export class DocsUpdatedByColumn1599768880392 implements MigrationInterface {
  name = 'DocsUpdatedByColumn1599768880392'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" ADD COLUMN "updatedBy" INTEGER DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" DROP COLUMN "updatedBy"`)
  }
}
