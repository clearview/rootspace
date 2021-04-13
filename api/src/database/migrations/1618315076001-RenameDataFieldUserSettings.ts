import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameDataFieldUserSettings1618315076001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "data" TO "ui"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "ui" TO "data"`)
    }

}
