import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsAddEntityIdColumn1598303316992 implements MigrationInterface {
  name = 'UploadsAddEntityIdColumn1598303316992'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "entityId" INTEGER DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "entityId"`)
  }
}
