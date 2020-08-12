import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDeletedAtToDocs1596916911810 implements MigrationInterface {
  name = 'AddDeletedAtToDocs1596916911810'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "docs" DROP COLUMN "deleted_at"`)
  }
}
