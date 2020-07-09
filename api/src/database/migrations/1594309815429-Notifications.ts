import {MigrationInterface, QueryRunner} from "typeorm";

export class Notifications1594309815429 implements MigrationInterface {
    name = 'Notifications1594309815429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "itemId" integer NOT NULL, "itemTable" character varying NOT NULL, "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a80e81f5a114c35c4122581390" ON "notifications" ("itemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_692a909ee0fa9383e7859f9b40" ON "notifications" ("userId") `);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`DROP INDEX "IDX_692a909ee0fa9383e7859f9b40"`);
        await queryRunner.query(`DROP INDEX "IDX_a80e81f5a114c35c4122581390"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
