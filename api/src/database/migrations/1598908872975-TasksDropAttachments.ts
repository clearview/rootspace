import { MigrationInterface, QueryRunner } from 'typeorm'

export class TasksDropAttachments1598908872975 implements MigrationInterface {
  name = 'TasksDropAttachments1598908872975'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN IF EXISTS "attachments"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
