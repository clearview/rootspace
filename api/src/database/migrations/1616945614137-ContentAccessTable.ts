import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class ContentAccessTable1616945614137 implements MigrationInterface {
  name = 'ContentAccessTable1616945614137'

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

    table.addIndex(new TableIndex({ columnNames: ['entityId'] }))
    table.addIndex(new TableIndex({ columnNames: ['entity'] }))

    await queryRunner.createTable(table, true, true, true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('content_access', true, true, true)
  }
}
