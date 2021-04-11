import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class CreateStorageTable1617814485000 implements MigrationInterface {
  name = 'CreateStorageTable1617814485000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'storages',
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
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'createdAt',
          type: 'TIMESTAMP WITH TIME ZONE',
          default: 'now()',
        },
        {
          name: 'updatedAt',
          type: 'TIMESTAMP WITH TIME ZONE',
          isNullable: true
        },
        {
          name: 'deletedAt',
          type: 'TIMESTAMP WITH TIME ZONE',
          isNullable: true
        },
      ],
    })

    table.addIndex(new TableIndex({ columnNames: ['userId'] }))
    table.addIndex(new TableIndex({ columnNames: ['spaceId'] }))

    table.addForeignKey(
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )

    table.addForeignKey(
      new TableForeignKey({
        columnNames: ['spaceId'],
        referencedTableName: 'spaces',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )

    await queryRunner.createTable(table, true, true, true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('storages', true, true, true)
  }
}
