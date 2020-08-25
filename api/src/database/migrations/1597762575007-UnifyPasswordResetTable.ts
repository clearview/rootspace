import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyPasswordResetTable1597762575007 implements MigrationInterface {
    name = 'UnifyPasswordResetTable1597762575007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_resets" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "password_resets" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "password_resets" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "password_resets" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_resets" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "password_resets" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "password_resets" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "password_resets" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
