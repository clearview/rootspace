import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBoardIdToTasks1597762576000 implements MigrationInterface {
  name = 'AddBoardIdToTasks1597762576000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" ADD COLUMN "boardId" INTEGER`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "boardId"`)
  }
}
