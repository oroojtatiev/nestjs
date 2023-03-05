import {MigrationInterface, QueryRunner} from 'typeorm'

export class user1667586420442 implements MigrationInterface {
  name = 'user1667586420442'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user"
                             (
                               "id"               SERIAL                NOT NULL,
                               "firstname"        character varying(15) NOT NULL,
                               "lastname"         character varying(15) NOT NULL,
                               "email"            character varying     NOT NULL,
                               "password"         character varying(60) NOT NULL,
                               "token"            character varying(255),
                               "tokenExpire"      TIMESTAMP,
                               "isEmailConfirmed" boolean               NOT NULL DEFAULT false,
                               "createdAt"        TIMESTAMP             NOT NULL DEFAULT now(),
                               "updatedAt"        TIMESTAMP                      DEFAULT now(),
                               "deletedAt"        TIMESTAMP,
                               CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                             )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "user"')
  }

}
