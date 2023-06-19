import {MigrationInterface, QueryRunner} from 'typeorm'

export class UserRole1678532786512 implements MigrationInterface {
    name = 'UserRole1678532786512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."user_roles_enum" AS ENUM(\'user\', \'admin\')')
        await queryRunner.query('ALTER TABLE "user" ADD "roles" "public"."user_roles_enum" array NOT NULL DEFAULT \'{user}\'')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "roles"')
        await queryRunner.query('DROP TYPE "public"."user_roles_enum"')
    }
}
