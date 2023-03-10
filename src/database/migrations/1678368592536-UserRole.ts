import {MigrationInterface, QueryRunner} from 'typeorm'

export class UserRole1678368592536 implements MigrationInterface {
    name = 'UserRole1678368592536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."user_role_enum" AS ENUM(\'user\', \'admin\')')
        await queryRunner.query('ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT \'user\'')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "role"')
        await queryRunner.query('DROP TYPE "public"."user_role_enum"')
    }

}
