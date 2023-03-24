import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDeletedAtToEmbeds1597762574130 implements MigrationInterface {
  name = 'AddDeletedAtToEmbeds1597762574130'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "embeds" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "embeds" DROP COLUMN "deleted_at"`)
  }
}
