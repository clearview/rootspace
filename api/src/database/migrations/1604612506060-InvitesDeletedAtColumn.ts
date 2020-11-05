import { MigrationInterface, QueryRunner } from 'typeorm'

export class InvitesDeletedAtColumn1604612506060 implements MigrationInterface {
  name = 'InvitesDeletedAtColumn1604612506060'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invites" ADD COLUMN "deletedAt" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "deletedAt"`)
  }
}
