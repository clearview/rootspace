import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyNodesTable1597762575005 implements MigrationInterface {
    name = 'UnifyNodesTable1597762575005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nodes" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "nodes" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "updated" TO "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "deleted_at" TO "deletedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "deletedAt" TO "deleted_at"`)
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "nodes" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "nodes" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
