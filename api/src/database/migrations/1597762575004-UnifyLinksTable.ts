import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyLinksTable1597762575004 implements MigrationInterface {
    name = 'UnifyLinksTable1597762575004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "updated" TO "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "deleted_at" TO "deletedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "deletedAt" TO "deleted_at"`)
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
