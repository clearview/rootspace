import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyEmbedTable1597762575001 implements MigrationInterface {
    name = 'UnifyEmbedTable1597762575001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeds" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "embeds" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "updated" TO "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "deleted_at" TO "deletedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "deletedAt" TO "deleted_at"`)
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "embeds" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "embeds" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
