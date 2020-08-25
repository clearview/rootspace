import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyUserToSpaceTable1597762575014 implements MigrationInterface {
    name = 'UnifyUserToSpaceTable1597762575014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_spaces" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "users_spaces" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "users_spaces" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "users_spaces" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_spaces" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "users_spaces" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "users_spaces" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "users_spaces" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
