import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyUsersTable1597762575012 implements MigrationInterface {
    name = 'UnifyUsersTable1597762575012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
