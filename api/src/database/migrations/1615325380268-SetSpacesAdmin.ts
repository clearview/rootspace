import { MigrationInterface, QueryRunner } from 'typeorm'

export class SetSpacesAdmin1615325380268 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE users_spaces SET "role" = 0 FROM spaces WHERE users_spaces."spaceId" = spaces.id AND users_spaces."userId" = spaces."userId"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
