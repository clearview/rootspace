import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPositionOnTaskBoardTagsTable1648699125503 implements MigrationInterface {
    name = 'AddPositionOnTaskBoardTagsTable1648699125503'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_board_tags" ADD COLUMN "position" integer NULL DEFAULT 0`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_board_tags" DROP COLUMN "position"`)
    }

}
