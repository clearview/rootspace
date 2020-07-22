import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSlugColumnToTasks1593943940618 implements MigrationInterface {
    name = 'AddSlugColumnToTasks1593943940618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "slug" character varying`)
        await queryRunner.query(`UPDATE tasks SET slug = REPLACE(LOWER(title), ' ', '-')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "slug"`)
    }
}
