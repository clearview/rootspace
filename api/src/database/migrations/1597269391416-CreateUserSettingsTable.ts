import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { TableForeignKey, TableIndex } from 'typeorm/index'

export class CreateUserSettingsTable1597269391416
  implements MigrationInterface {
  name = 'CreateUserSettingsTable1597269391416'
  tableName = 'user_settings'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
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

    await queryRunner.createIndex(this.tableName, new TableIndex({
      name: 'IDX_USER_SETTINGS_USER_ID',
      columnNames: ['userId']
    }))

    await queryRunner.createIndex(this.tableName, new TableIndex({
      name: 'IDX_USER_SETTINGS_SPACE_ID',
      columnNames: ['spaceId']
    }))

    await queryRunner.createForeignKey(this.tableName, new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION'
    }))

    await queryRunner.createForeignKey(this.tableName, new TableForeignKey({
      columnNames: ['spaceId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'spaces',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)
    const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1)
    await queryRunner.dropForeignKey(this.tableName, userForeignKey)

    const spaceForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('spaceId') !== -1)
    await queryRunner.dropForeignKey(this.tableName, spaceForeignKey)

    await queryRunner.dropIndex(this.tableName, 'IDX_USER_SETTINGS_USER_ID')
    await queryRunner.dropIndex(this.tableName, 'IDX_USER_SETTINGS_SPACE_ID')

    await queryRunner.dropTable(this.tableName, true, true, true)
  }
}
