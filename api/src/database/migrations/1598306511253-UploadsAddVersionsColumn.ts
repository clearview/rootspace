import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsAddVersionsColumn1598306511253 implements MigrationInterface {
  name = 'UploadsAddVersionsColumn1598306511253'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "versions" JSON DEFAULT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "versions"`)
  }
}
