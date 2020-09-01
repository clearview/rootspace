import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTypeColumnToEmbedsTable1598424744719 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeds" ADD COLUMN "type" varchar`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeds" DROP COLUMN "type"`)
    }

}
