import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class AddDeletedAtToTaskBoardTable1596648092000 implements MigrationInterface {
    name = 'AddDeletedAtToTaskBoardTable1596648092000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_boards" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_boards" DROP COLUMN "deleted_at"`)
    }

}
