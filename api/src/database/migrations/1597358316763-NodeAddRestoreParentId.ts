import { MigrationInterface, QueryRunner } from 'typeorm'

export class NodeAddRestoreParentId1597358316763 implements MigrationInterface {
  name = 'NodeAddRestoreParentId1597358316763'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nodes" ADD COLUMN "restoreParentId" INTEGER DEFAULT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nodes" DROP COLUMN "restoreParentId"`)
  }
}
