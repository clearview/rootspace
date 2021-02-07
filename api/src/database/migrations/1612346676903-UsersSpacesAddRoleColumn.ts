import {MigrationInterface, QueryRunner} from "typeorm";

export class UsersSpacesAddRoleColumn1612346676903 implements MigrationInterface {
    name = 'UsersSpacesAddRoleColumn1612346676903'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_spaces" ADD COLUMN "roleId" INTEGER NOT NULL DEFAULT 1`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_spaces" DROP COLUMN "roleId"`)
    }

}
