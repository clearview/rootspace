import { MigrationInterface, QueryRunner } from 'typeorm'

export class DocsContentUpdatedAtColumn1600027392865 implements MigrationInterface {
  name = 'DocsContentUpdatedAtColumn1600027392865'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" ADD COLUMN "contentUpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" DROP COLUMN "contentUpdatedAt"`)
  }
}
