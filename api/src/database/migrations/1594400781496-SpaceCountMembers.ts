import { MigrationInterface, QueryRunner } from 'typeorm'

export class SpaceCountMembers1594400781496 implements MigrationInterface {
    name = 'SpaceCountMembers1594400781496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "countMembers" SET DEFAULT 1`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "countMembers" SET DEFAULT 0`)
    }

}
