import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsAddEntityColumn1598303305885 implements MigrationInterface {
  name = 'UploadsAddEntityColumn1598303305885'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "entity" VARCHAR DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "entity"`)
  }
}
