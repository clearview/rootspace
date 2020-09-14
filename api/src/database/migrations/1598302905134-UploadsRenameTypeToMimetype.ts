import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsRenameTypeToMime1598302905134 implements MigrationInterface {
  name = 'UploadsRenameTypeToMime1598302905134'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "type" TO "mimetype"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "mimetype" TO "type"`)
  }
}
