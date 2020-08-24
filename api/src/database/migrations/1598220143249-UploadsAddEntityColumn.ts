import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsAddEntityColumn1598220143249 implements MigrationInterface {
  name = 'UploadsAddEntityColumn1598220143249'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "entity" VARCHAR DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "entity"`)
  }
}
