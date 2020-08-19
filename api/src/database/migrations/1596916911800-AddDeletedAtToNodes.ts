import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDeletedAtToNodes1596916911800 implements MigrationInterface {
  name = 'AddDeletedAtToNodes1596916911800'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nodes" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nodes" DROP COLUMN "deleted_at"`)
  }
}
