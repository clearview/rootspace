import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsSpaceIdNullable1599138236195 implements MigrationInterface {
  name = 'UploadsSpaceIdNullable1599138236195'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "spaceId" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "spaceId" SET NOT NULL`)
  }
}
