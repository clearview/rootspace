import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsAddTypeColumn1598303330262 implements MigrationInterface {
  name = 'UploadsAddTypeColumn1598303330262'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "type" VARCHAR DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "type"`)
  }
}
