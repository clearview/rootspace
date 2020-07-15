import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateEmbedTable1594850644622 implements MigrationInterface {
  name = 'CreateEmbedTable1594850644622'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'embeds',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
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
            name: 'content',
            type: 'text',
          },
          {
            name: 'created',
            type: 'timestamptz',
          },
          {
            name: 'updated',
            type: 'timestamptz',
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('embeds', true)
  }
}
