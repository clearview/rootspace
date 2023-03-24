import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateActivities1594850644900 implements MigrationInterface {
    name = 'CreateActivities1594850644900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
              name: 'activities',
              columns: [
                  {
                      name: 'id',
                      type: 'int',
                      isPrimary: true,
                      isGenerated: true,
                      generationStrategy: 'increment',
                  },
                  {
                      name: 'actorId',
                      type: 'int',
                  },
                  {
                      name: 'spaceId',
                      type: 'int',
                  },
                  {
                      name: 'entityId',
                      type: 'int',
                  },
                  {
                      name: 'entity',
                      type: 'varchar',
                  },
                  {
                      name: 'tableName',
                      type: 'varchar',
                  },
                  {
                      name: 'action',
                      type: 'varchar',
                  },
                  {
                      name: 'data',
                      type: 'json',
                      isNullable: false,
                      default: `'{}'`
                  },
                  {
                      name: 'createdAt',
                      type: 'timestamp',
                      default: 'now()',
                  }
              ],
          }),
          true
        )

        await queryRunner.query(`CREATE INDEX "IDX_be77588a6727c9a27075b59115" ON "activities" ("actorId") `)
        await queryRunner.query(`CREATE INDEX "IDX_be77588a6727c9a27075b59125" ON "activities" ("spaceId") `)
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9dddf4dc85" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9dddf4dc86" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9dddf4dc86"`)
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9dddf4dc85"`)
        await queryRunner.query(`DROP INDEX "IDX_be77588a6727c9a27075b59125"`)
        await queryRunner.query(`DROP INDEX "IDX_be77588a6727c9a27075b59115"`)
        await queryRunner.query(`DROP TABLE "activities"`)
    }

}
