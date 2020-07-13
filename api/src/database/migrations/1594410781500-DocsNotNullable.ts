import { MigrationInterface, QueryRunner } from 'typeorm'

export class DocsNotNullable1594410781500 implements MigrationInterface {
    name = 'DocsNotNullable1594410781500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "userId" SET NOT NULL`)
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "spaceId" SET NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "userId" SET NULL`)
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "spaceId" SET NULL`)
    }

}
