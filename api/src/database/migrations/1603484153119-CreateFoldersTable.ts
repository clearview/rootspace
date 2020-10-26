import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateFoldersTable1603484153119 implements MigrationInterface {
  name = 'CreateFoldersTable1603484153119'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'folders',
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
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'deletedAt',
          type: 'TIMESTAMP WITH TIME ZONE',
          isNullable: true,
        },
      ],
    })

    table.addIndex(new TableIndex({ columnNames: ['userId'] }))
    table.addIndex(new TableIndex({ columnNames: ['spaceId'] }))

    await queryRunner.createTable(table, true, true, true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('folders', true, true, true)
  }
}
