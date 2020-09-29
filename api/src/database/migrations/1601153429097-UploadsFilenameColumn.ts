import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsFilenameColumn1601153429097 implements MigrationInterface {
  name = 'UploadsFilenameColumn1601153429097'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "filename" VARCHAR`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "filename"`)
  }
}
