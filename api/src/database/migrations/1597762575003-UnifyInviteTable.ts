import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyInviteTable1597762575003 implements MigrationInterface {
    name = 'UnifyInviteTable1597762575003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invites" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "invites" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "invites" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "invites" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
