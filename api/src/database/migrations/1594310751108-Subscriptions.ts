import {MigrationInterface, QueryRunner} from "typeorm";

export class Subscriptions1594310751108 implements MigrationInterface {
    name = 'Subscriptions1594310751108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "itemId" integer NOT NULL, "itemTable" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f198869533cb21cd0f3524821d" ON "subscriptions" ("itemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8" ON "subscriptions" ("userId") `);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`);
        await queryRunner.query(`DROP INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8"`);
        await queryRunner.query(`DROP INDEX "IDX_f198869533cb21cd0f3524821d"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
    }

}
