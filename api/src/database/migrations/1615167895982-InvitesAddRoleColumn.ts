import { MigrationInterface, QueryRunner } from 'typeorm'

export class InvitesAddRoleColumn1615167895982 implements MigrationInterface {

    name = 'InvitesAddRoleColumn1615167895982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invites" ADD COLUMN "role" INTEGER NOT NULL DEFAULT 1`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "role"`)
    }

}
