import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifySpaceTable1597762575008 implements MigrationInterface {
    name = 'UnifySpaceTable1597762575008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "spaces" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "spaces" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spaces" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "spaces" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
