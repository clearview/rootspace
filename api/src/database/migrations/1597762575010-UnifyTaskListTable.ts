import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyTaskListTable1597762575010 implements MigrationInterface {
    name = 'UnifyTaskListTable1597762575010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_lists" RENAME COLUMN "deleted_at" TO "deletedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_lists" RENAME COLUMN "deletedAt" TO "deleted_at"`)
    }
}
