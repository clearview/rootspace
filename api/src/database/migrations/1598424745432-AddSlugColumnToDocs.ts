import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSlugColumnToDocs1598424745432 implements MigrationInterface {
    name='AddSlugColumnToDocs1598424745432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docs" ADD "slug" character varying`)
        await queryRunner.query(`UPDATE docs SET slug = REPLACE(LOWER(title), ' ', '-')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docs" DROP COLUMN "slug"`)
    }
}
