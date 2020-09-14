import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddContextToActivities1598424745000 implements MigrationInterface {
    name='AddContextToActivities1598424745000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" ADD "data" jsonb DEFAULT '{}'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "data"`)
    }
}
