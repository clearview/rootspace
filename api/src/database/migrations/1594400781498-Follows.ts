import { MigrationInterface, QueryRunner } from 'typeorm'

export class Follows1594400781498 implements MigrationInterface {
    name = 'Follows1594400781498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follows" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "itemId" integer NOT NULL, "tableName" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE INDEX "IDX_f198869533cb21cd0f3524821d" ON "follows" ("itemId") `)
        await queryRunner.query(`CREATE INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8" ON "follows" ("userId") `)
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`)
        await queryRunner.query(`DROP INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8"`)
        await queryRunner.query(`DROP INDEX "IDX_f198869533cb21cd0f3524821d"`)
        await queryRunner.query(`DROP TABLE "follows"`)
    }

}
