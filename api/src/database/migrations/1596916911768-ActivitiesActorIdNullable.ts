import { MigrationInterface, QueryRunner } from 'typeorm'

export class ActivitiesActorIdNullable1596916911768
  implements MigrationInterface {
  name = 'ActivitiesActorIdNullable1596916911768'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "actorId" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "actorId" SET NOT NULL`)
  }
}
