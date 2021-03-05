import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUrlQueryParamsToPasswordResets1613687671805 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_resets" ADD COLUMN "urlQueryParams" TEXT DEFAULT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_resets" DROP COLUMN "urlQueryParams"`)
    }

}
