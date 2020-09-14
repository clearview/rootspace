import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class DocRevisionsTable1599776336471 implements MigrationInterface {
  name = 'DocRevisionsTable1599776336471'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'doc_revisions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'docId',
            type: 'integer',
          },
          {
            name: 'userId',
            type: 'integer',
          },
          {
            name: 'spaceId',
            type: 'integer',
          },

          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'json',
          },
          {
            name: 'revisionBy',
            type: 'integer',
          },
          {
            name: 'revisionAt',
            type: 'TIMESTAMP WITH TIME ZONE',
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('doc_revisions', true)
  }
}
