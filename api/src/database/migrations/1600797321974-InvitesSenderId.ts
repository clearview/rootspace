import { MigrationInterface, QueryRunner } from 'typeorm'

export class InvitesSenderId1600797321974 implements MigrationInterface {
  name = 'InvitesSenderId1600797321974'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invites" ADD COLUMN "senderId" INTEGER`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "senderId"`)
  }
}
