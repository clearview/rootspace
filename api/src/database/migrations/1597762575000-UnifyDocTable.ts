import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyDocTable1597762575000 implements MigrationInterface {
    name = 'UnifyDocTable1597762575000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "updated" TO "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "deleted_at" TO "deletedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "deletedAt" TO "deleted_at"`)
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
