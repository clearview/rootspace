import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSettingsColumnToTaskList1594850644800 implements MigrationInterface {
    name = 'AddSettingsColumnToTaskList1594850644800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_lists" ADD "settings" json NOT NULL DEFAULT '{}'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_lists" DROP COLUMN "settings"`)
    }
}
