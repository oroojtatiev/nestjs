import {MigrationInterface, QueryRunner} from 'typeorm'

export class UserChanges1678446740844 implements MigrationInterface {
    name = 'UserChanges1678446740844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."user_roles_enum" AS ENUM(\'user\', \'admin\')')
        await queryRunner.query('ALTER TABLE "user" ADD "roles" "public"."user_roles_enum" array NOT NULL DEFAULT \'{user}\'')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "roles"')
        await queryRunner.query('DROP TYPE "public"."user_roles_enum"')
    }

}
