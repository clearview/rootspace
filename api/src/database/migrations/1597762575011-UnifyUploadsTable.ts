import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyUploadsTable1597762575011 implements MigrationInterface {
    name = 'UnifyUploadsTable1597762575011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
