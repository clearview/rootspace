import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreatePasswordResetsTable1596648090965
  implements MigrationInterface {
  name = 'CreatePasswordResetsTable1596648090965'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'password_resets',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'token',
            type: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'expiration',
            type: 'timestamp',
          },
          {
            name: 'active',
            type: 'boolean',
            default: 'true',
          },
          {
            name: 'created',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('password_resets', true)
  }
}
