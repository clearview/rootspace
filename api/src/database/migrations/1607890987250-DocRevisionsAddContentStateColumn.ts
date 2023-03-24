import { MigrationInterface, QueryRunner } from 'typeorm'

export class DocRevisionsAddContentStateColumn1607890987250 implements MigrationInterface {
  name = 'DocRevisionsAddContentStateColumn1607890987250'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "doc_revisions" ADD COLUMN "contentState" int[]`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "doc_revisions" DROP COLUMN IF EXISTS "contentState"`)
  }
}
