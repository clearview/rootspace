import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNewTabColumnToLinks1596555501687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ADD COLUMN "newTab" bool DEFAULT 'no'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "newTab"`)
    }

}
