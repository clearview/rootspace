import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyUserSettingsTable1597762575013 implements MigrationInterface {
    name = 'UnifyUserSettingsTable1597762575013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "user_settings" ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "created_at" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "updated_at" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "updatedAt" TO "updated_at"`)
        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "createdAt" TO "created_at"`)

        await queryRunner.query(`ALTER TABLE "user_settings" ALTER COLUMN "updated_at" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "user_settings" ALTER COLUMN "created_at" TYPE TIMESTAMP`)
    }
}
