import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsNameColumn1618003745798 implements MigrationInterface {
  name = 'UploadsNameColumn1618003745798'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "name" VARCHAR DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN IF EXISTS "name"`)
  }
}
