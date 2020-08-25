import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyNotificationsTable1597762575006 implements MigrationInterface {
    name = 'UnifyNotificationsTable1597762575006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
