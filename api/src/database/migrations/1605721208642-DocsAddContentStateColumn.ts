import { MigrationInterface, QueryRunner } from 'typeorm'

export class DocsAddContentStateColumn1605721208642 implements MigrationInterface {
  name = 'DocsAddContentStateColumn1605721208642'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" ADD COLUMN "contentState" int[]`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" DROP COLUMN IF EXISTS "contentState"`)
  }
}
