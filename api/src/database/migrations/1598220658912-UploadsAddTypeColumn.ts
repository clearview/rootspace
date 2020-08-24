import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsAddTypeColumn1598220658912 implements MigrationInterface {
  name = 'UploadsAddTypeColumn1598220658912'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "contentType" VARCHAR DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "contentType"`)
  }
}
