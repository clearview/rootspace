import { MigrationInterface, QueryRunner } from 'typeorm'

export class ActivitiesDropTableName1604354208286 implements MigrationInterface {
  name = 'ActivitiesDropTableName1604354208286'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "tableName"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
