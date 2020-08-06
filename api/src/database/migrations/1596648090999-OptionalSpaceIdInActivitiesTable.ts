import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class OptionalSpaceIdInActivitiesTable1596648090999 implements MigrationInterface {
    name = 'OptionalSpaceIdInActivitiesTable1596648090999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "spaceId" DROP NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "spaceId" SET NOT NULL`)
    }

}
