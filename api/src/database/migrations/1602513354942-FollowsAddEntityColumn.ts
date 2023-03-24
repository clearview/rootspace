import { MigrationInterface, QueryRunner } from 'typeorm'

export class FollowsAddEntityColumn1602513354942 implements MigrationInterface {
  name = 'FollowsAddEntityColumn1602513354942'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "follows" ADD COLUMN "entity" VARCHAR`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "entity"`)
  }
}
