import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPreferencesToUserSettings1618315076000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" ADD COLUMN "preferences" jsonb DEFAULT '{}'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "preferences"`)
    }

}
