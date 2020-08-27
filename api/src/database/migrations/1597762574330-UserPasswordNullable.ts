import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserPasswordNullable1597762574330
  implements MigrationInterface {
  name = 'UserPasswordNullable1597762574330'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`)
  }
}
