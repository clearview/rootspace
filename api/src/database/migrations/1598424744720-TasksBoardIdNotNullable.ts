import { MigrationInterface, QueryRunner } from 'typeorm'

export class TasksBoardIdNotNullable1598424744720 implements MigrationInterface {
    name='TasksBoardIdNotNullable1598424744720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "boardId" SET NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "boardId" SET NULL`)
    }
}
