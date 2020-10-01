import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsRenamePathToLocation1601282624106 implements MigrationInterface {
  name = 'UploadsRenamePathToLocation1601282624106'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN path TO location`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN location TO path`)
  }
}
