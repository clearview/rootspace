import { MigrationInterface, QueryRunner } from 'typeorm'

export class DocumentAddIsLockedColumn1594152616623
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE docs ADD "isLocked" BOOLEAN NOT NULL DEFAULT FALSE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE docs DROP COLUMN "isLocked"`)
  }
}
