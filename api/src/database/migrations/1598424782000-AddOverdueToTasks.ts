import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOverdueToTasks1598424782000 implements MigrationInterface {
    name='AddOverdueToTasks1598424782000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "isOverdue" BOOLEAN NOT NULL DEFAULT FALSE`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "isOverdue"`)
    }
}
