import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class JoinActivitiesAndNotifications1594850644901 implements MigrationInterface {
    name = 'JoinActivitiesAndNotifications1594850644901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "activityId" integer NOT NULL`)
        await queryRunner.query(`CREATE INDEX "IDX_692a909ee0fa9383e7859f9b41" ON "notifications" ("activityId") `)
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b408" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b408"`)
        await queryRunner.query(`DROP INDEX "IDX_692a909ee0fa9383e7859f9b41"`)
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "activityId"`)
    }

}
