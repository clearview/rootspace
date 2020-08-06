import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class RemoveDataFromActivitiesTable1596648091000 implements MigrationInterface {
    name = 'RemoveDataFromActivitiesTable1596648091000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "data"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" ADD "data" json NOT NULL DEFAULT '{}'`)
    }

}
