import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsKeyColumn1599167333473 implements MigrationInterface {
  name = 'UploadsKeyColumn1599167333473'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "key" VARCHAR DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "key"`)
  }
}
