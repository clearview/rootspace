import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsSetPathNullable1601155520929 implements MigrationInterface {
  name = 'UploadsSetPathNullable1601155520929'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "path" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "path" SET NOT NULL`)
  }
}
