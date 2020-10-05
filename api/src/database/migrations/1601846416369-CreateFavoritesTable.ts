import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class CreateFavoritesTable1601846416369 implements MigrationInterface {
  name = 'CreateFavoritesTable1601846416369'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'favorites',
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
          name: 'nodeId',
          type: 'int',
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    })

    table.addIndex(new TableIndex({ columnNames: ['userId'] }))

    table.addForeignKey(
      new TableForeignKey({
        columnNames: ['nodeId'],
        referencedTableName: 'nodes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )

    await queryRunner.createTable(table, true, true, true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('favorites', true, true, true)
  }
}
