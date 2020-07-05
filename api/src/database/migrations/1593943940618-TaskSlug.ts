import { MigrationInterface, QueryRunner } from 'typeorm'

export class TaskSlug1593943940618 implements MigrationInterface {
    name = 'TaskSlug1593943940618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "slug" character varying NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "slug"`)
    }

}
