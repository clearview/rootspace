import { MigrationInterface, QueryRunner } from 'typeorm'

export class UnifyFieldNames1597762575000 implements MigrationInterface {
    name = 'UnifyFieldNames1597762575000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Docs
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "updated" TO "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "deleted_at" TO "deletedAt"`)

        // Embeds
        await queryRunner.query(`ALTER TABLE "embeds" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "embeds" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "updated" TO "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "deleted_at" TO "deletedAt"`)

        // Follows
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "updated" TO "updatedAt"`)

        // Invites
        await queryRunner.query(`ALTER TABLE "invites" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "invites" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "updated" TO "updatedAt"`)

        // Links
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "updated" TO "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "deleted_at" TO "deletedAt"`)

        // Nodes
        await queryRunner.query(`ALTER TABLE "nodes" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "nodes" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "updated" TO "updatedAt"`)
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "deleted_at" TO "deletedAt"`)

        // Notifications
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "updated" TO "updatedAt"`)

        // PasswordResets
        await queryRunner.query(`ALTER TABLE "password_resets" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "password_resets" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "password_resets" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "password_resets" RENAME COLUMN "updated" TO "updatedAt"`)

        // Spaces
        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "spaces" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "spaces" RENAME COLUMN "updated" TO "updatedAt"`)

        // TaskBoards
        await queryRunner.query(`ALTER TABLE "task_boards" RENAME COLUMN "deleted_at" TO "deletedAt"`)

        // TaskLists
        await queryRunner.query(`ALTER TABLE "task_lists" RENAME COLUMN "deleted_at" TO "deletedAt"`)

        // Uploads
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "updated" TO "updatedAt"`)

        // Users
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updated" TO "updatedAt"`)

        // UserSettings
        await queryRunner.query(`ALTER TABLE "user_settings" ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "user_settings" ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "created_at" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "updated_at" TO "updatedAt"`)

        // UserSpaces
        await queryRunner.query(`ALTER TABLE "users_spaces" ALTER COLUMN "created" TYPE TIMESTAMP WITH TIME ZONE`)
        await queryRunner.query(`ALTER TABLE "users_spaces" ALTER COLUMN "updated" TYPE TIMESTAMP WITH TIME ZONE`)

        await queryRunner.query(`ALTER TABLE "users_spaces" RENAME COLUMN "created" TO "createdAt"`)
        await queryRunner.query(`ALTER TABLE "users_spaces" RENAME COLUMN "updated" TO "updatedAt"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // UserSpaces
        await queryRunner.query(`ALTER TABLE "users_spaces" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "users_spaces" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "users_spaces" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "users_spaces" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // UserSettings
        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "updatedAt" TO "updated_at"`)
        await queryRunner.query(`ALTER TABLE "user_settings" RENAME COLUMN "createdAt" TO "created_at"`)

        await queryRunner.query(`ALTER TABLE "user_settings" ALTER COLUMN "updated_at" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "user_settings" ALTER COLUMN "created_at" TYPE TIMESTAMP`)

        // Users
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // Uploads
        await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "uploads" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "uploads" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // TaskLists
        await queryRunner.query(`ALTER TABLE "task_lists" RENAME COLUMN "deletedAt" TO "deleted_at"`)

        // TaskBoards
        await queryRunner.query(`ALTER TABLE "task_boards" RENAME COLUMN "deletedAt" TO "deleted_at"`)

        // Spaces
        await queryRunner.query(`ALTER TABLE "spaces" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "spaces" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "spaces" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // PasswordResets
        await queryRunner.query(`ALTER TABLE "password_resets" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "password_resets" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "password_resets" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "password_resets" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // Notifications
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // Nodes
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "deletedAt" TO "deleted_at"`)
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "nodes" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "nodes" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "nodes" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // Links
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "deletedAt" TO "deleted_at"`)
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // Invites
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "invites" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "invites" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // Follows
        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "follows" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // Embeds
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "deletedAt" TO "deleted_at"`)
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "embeds" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "embeds" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "embeds" ALTER COLUMN "created" TYPE TIMESTAMP`)

        // Docs
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "deletedAt" TO "deleted_at"`)
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "updatedAt" TO "updated"`)
        await queryRunner.query(`ALTER TABLE "docs" RENAME COLUMN "createdAt" TO "created"`)

        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "updated" TYPE TIMESTAMP`)
        await queryRunner.query(`ALTER TABLE "docs" ALTER COLUMN "created" TYPE TIMESTAMP`)
    }
}
