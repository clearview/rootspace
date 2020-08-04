import { MigrationInterface, QueryRunner } from 'typeorm'

export class Notifications1594400781497 implements MigrationInterface {
    name = 'Notifications1594400781497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "spaceId" integer NOT NULL, "userId" integer NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE INDEX "IDX_a80e81f5a114c35c4122581389" ON "notifications" ("spaceId") `)
        await queryRunner.query(`CREATE INDEX "IDX_692a909ee0fa9383e7859f9b40" ON "notifications" ("userId") `)
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b407" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b407"`)
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`)
        await queryRunner.query(`DROP INDEX "IDX_692a909ee0fa9383e7859f9b40"`)
        await queryRunner.query(`DROP INDEX "IDX_a80e81f5a114c35c4122581389"`)
        await queryRunner.query(`DROP TABLE "notifications"`)
    }
}
