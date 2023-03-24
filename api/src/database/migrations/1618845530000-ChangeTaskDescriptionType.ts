import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeTaskDescriptionType1618845530000 implements MigrationInterface {
  name = 'ChangeTaskDescriptionType1618845530000'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "description" TYPE jsonb USING description::jsonb`)
    await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "description" SET DEFAULT '{}'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "description" TYPE text`)
    await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "description" SET NOT NULL`)
  }
}
