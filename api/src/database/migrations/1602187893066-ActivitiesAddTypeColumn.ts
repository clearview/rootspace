import { MigrationInterface, QueryRunner } from 'typeorm'

export class ActivitiesAddTypeColumn1602187893066 implements MigrationInterface {
  name = 'ActivitiesAddTypeColumn1602187893066'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activities" ADD COLUMN "type" VARCHAR`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "type"`)
  }
}
