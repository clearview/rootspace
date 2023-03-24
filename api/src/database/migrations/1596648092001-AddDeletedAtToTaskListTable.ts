import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class AddDeletedAtToTaskListTable1596648092001 implements MigrationInterface {
    name = 'AddDeletedAtToTaskListTable1596648092001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_lists" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_lists" DROP COLUMN "deleted_at"`)
    }

}
