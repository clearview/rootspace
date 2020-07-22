import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTaskActivities1594850644700 implements MigrationInterface {
    name = 'CreateTaskActivities1594850644700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_activities" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "taskId" integer NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_83b99b0b03db29d4cafcb579b78" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE INDEX "IDX_be77588a6727c9a27075b59005" ON "task_comments" ("userId") `)
        await queryRunner.query(`CREATE INDEX "IDX_ba265816ca1d93f51083e06c53" ON "task_comments" ("taskId") `)
        await queryRunner.query(`ALTER TABLE "task_activities" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc85" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
        await queryRunner.query(`ALTER TABLE "task_activities" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc86" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_activities" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc86"`)
        await queryRunner.query(`ALTER TABLE "task_activities" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc85"`)
        await queryRunner.query(`DROP INDEX "IDX_ba265816ca1d93f51083e06c53"`)
        await queryRunner.query(`DROP INDEX "IDX_be77588a6727c9a27075b59005"`)
        await queryRunner.query(`DROP TABLE "task_activities"`)
    }

}
