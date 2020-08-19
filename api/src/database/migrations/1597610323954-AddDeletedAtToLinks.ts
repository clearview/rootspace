import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDeletedAtToLinks1597610323954 implements MigrationInterface {
  name = 'AddDeletedAtToLinks1597610323954'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "deleted_at"`)
  }
}
