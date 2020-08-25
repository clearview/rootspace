import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyFollowTable1597762575002 implements MigrationInterface {
    name = 'UnifyFollowTable1597762575002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
