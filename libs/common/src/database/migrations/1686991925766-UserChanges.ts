import {MigrationInterface, QueryRunner} from 'typeorm'

export class UserChanges1686991925766 implements MigrationInterface {
    name = 'UserChanges1686991925766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "is_email_confirmed"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "token_expire"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "token"')
        await queryRunner.query('ALTER TABLE "user" ADD "refresh_token" character varying(255)')
        await queryRunner.query('ALTER TABLE "user" ADD "is_email_verified" boolean NOT NULL DEFAULT false')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN IF EXISTS "is_email_verified"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN IF EXISTS "refresh_token"')
        await queryRunner.query('ALTER TABLE "user" ADD "token" character varying(255)')
        await queryRunner.query('ALTER TABLE "user" ADD "token_expire" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "user" ADD "is_email_confirmed" boolean NOT NULL DEFAULT false')
    }

}
