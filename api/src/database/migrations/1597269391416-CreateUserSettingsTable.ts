import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateUserSettingsTable1597269391416
  implements MigrationInterface {
  name = 'CreateUserSettingsTable1597269391416'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_settings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'spaceId',
            type: 'int',
            isNullable: true
          },
          {
            name: 'data',
            type: 'jsonb',
            isNullable: false,
            default: `'{}'`
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    )

    await queryRunner.query(`CREATE INDEX "IDX_be77588a6727c9a27075b59225" ON "user_settings" ("userId") `)
    await queryRunner.query(`CREATE INDEX "IDX_be77588a6727c9a27075b59226" ON "user_settings" ("spaceId") `)
    await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9bbbf4dc85" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9bbbf4dc86" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9bbbf4dc86"`)
    await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9bbbf4dc85"`)
    await queryRunner.query(`DROP INDEX "IDX_be77588a6727c9a27075b59226"`)
    await queryRunner.query(`DROP INDEX "IDX_be77588a6727c9a27075b59225"`)
    await queryRunner.dropTable('user_settings', true)
  }
}
