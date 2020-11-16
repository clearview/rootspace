import { MigrationInterface, QueryRunner } from 'typeorm'

export class FollowsDropTableName1605557271435 implements MigrationInterface {
  name = 'FollowsDropTableName1605557271435'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN IF EXISTS "tableName"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
