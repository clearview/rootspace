import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsDeletedAtColumn1622649926797 implements MigrationInterface {
  name = 'UploadsDeletedAtColumn1622649926797'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ADD COLUMN "deletedAt" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "deletedAt"`)
  }
}
