import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class DocsPublicIdColumn1619909699740 implements MigrationInterface {
  name = 'DocsPublicIdColumn1619909699740'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const column = new TableColumn({
      name: 'publicId',
      type: 'varchar',
      length: '21',
      isUnique: true,
      isNullable: true,
    })

    await queryRunner.addColumn('docs', column)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('docs', true, true, true)
  }
}
