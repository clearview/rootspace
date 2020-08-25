import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyTaskBoardTable1597762575009 implements MigrationInterface {
    name = 'UnifyTaskBoardTable1597762575009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_boards" RENAME COLUMN "deleted_at" TO "deletedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_boards" RENAME COLUMN "deletedAt" TO "deleted_at"`)
    }
}
