import { MigrationInterface, QueryRunner } from 'typeorm'

export class OnDeleteCascade1607890987300 implements MigrationInterface {
  name = 'OnDeleteCascade1607890987300'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users_spaces" DROP CONSTRAINT "FK_7be5d37768e62015159e900800e"`)
    await queryRunner.query(`ALTER TABLE "users_spaces" ADD CONSTRAINT "FK_7be5d37768e62015159e900800e" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)

    await queryRunner.query(`ALTER TABLE "task_boards" DROP CONSTRAINT "FK_38be8270ce70bbb7718948f75f2"`)
    await queryRunner.query(`ALTER TABLE "task_boards" ADD CONSTRAINT "FK_38be8270ce70bbb7718948f75f2" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)

    await queryRunner.query(`ALTER TABLE "task_lists" DROP CONSTRAINT "FK_ed0696ccce6fdf853d437e9be76"`)
    await queryRunner.query(`ALTER TABLE "task_lists" ADD CONSTRAINT "FK_ed0696ccce6fdf853d437e9be76" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)

    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9bef8994f7de994f638deb22cbf"`)
    await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9bef8994f7de994f638deb22cbf" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users_spaces" DROP CONSTRAINT "FK_7be5d37768e62015159e900800e"`)
    await queryRunner.query(`ALTER TABLE "users_spaces" ADD CONSTRAINT "FK_7be5d37768e62015159e900800e" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)

    await queryRunner.query(`ALTER TABLE "task_boards" DROP CONSTRAINT "FK_38be8270ce70bbb7718948f75f2"`)
    await queryRunner.query(`ALTER TABLE "task_boards" ADD CONSTRAINT "FK_38be8270ce70bbb7718948f75f2" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)

    await queryRunner.query(`ALTER TABLE "task_lists" DROP CONSTRAINT "FK_ed0696ccce6fdf853d437e9be76"`)
    await queryRunner.query(`ALTER TABLE "task_lists" ADD CONSTRAINT "FK_ed0696ccce6fdf853d437e9be76" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)

    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9bef8994f7de994f638deb22cbf"`)
    await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9bef8994f7de994f638deb22cbf" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }
}
