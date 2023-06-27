import {MigrationInterface, QueryRunner} from 'typeorm'

export class UserChanges1687760798138 implements MigrationInterface {
    name = 'UserChanges1687760798138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "refresh_token"')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ADD "refresh_token" character varying(255)')
    }
}
