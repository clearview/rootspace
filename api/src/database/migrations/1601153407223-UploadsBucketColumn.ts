import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsBucketColumn1601153407223 implements MigrationInterface {
  name = 'UploadsBucketColumn1601153407223'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "bucket" VARCHAR`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "bucket"`)
  }
}
