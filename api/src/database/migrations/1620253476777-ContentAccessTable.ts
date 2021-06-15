import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class ContentAccessTable1620253476777 implements MigrationInterface {
  name = 'ContentAccessTable1620253476777'
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'content_access',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'spaceId',
          type: 'int',
        },
        {
          name: 'ownerId',
          type: 'int',
        },
        {
          name: 'nodeId',
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
          name: 'type',
          type: 'varchar',
        },
        {
          name: 'public',
          type: 'boolean',
          default: false,
        },
      ],
    })

    table.addIndex(new TableIndex({ columnNames: ['nodeId'], isUnique: true }))
    table.addIndex(new TableIndex({ columnNames: ['entityId', 'entity'], isUnique: true }))

    table.addForeignKey(
      new TableForeignKey({
        columnNames: ['spaceId'],
        referencedTableName: 'spaces',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )

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
    await queryRunner.dropTable('content_access', true, true, true)
  }
}
