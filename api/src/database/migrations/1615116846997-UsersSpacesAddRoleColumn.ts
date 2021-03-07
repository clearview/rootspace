import { MigrationInterface, QueryRunner } from 'typeorm'

export class UsersSpacesAddRoleColumn1615116846997 implements MigrationInterface {
  name = 'UsersSpacesAddRoleColumn1615116846997'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users_spaces" ADD COLUMN "role" INTEGER NOT NULL DEFAULT 1`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users_spaces" DROP COLUMN "role"`)
  }
}
