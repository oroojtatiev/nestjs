import {MigrationInterface, QueryRunner} from 'typeorm'

export class productTypes1667564834860 implements MigrationInterface {
  name = 'productTypes1667564834860'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "product_types"
                             (
                                 "id"        SERIAL                NOT NULL,
                                 "name"      character varying(30) NOT NULL,
                                 "createdAt" TIMESTAMP             NOT NULL DEFAULT now(),
                                 "updatedAt" TIMESTAMP             NOT NULL DEFAULT now(),
                                 "deletedAt" TIMESTAMP,
                                 CONSTRAINT "PK_6ad7b08e6491a02ebc9ed82019d" PRIMARY KEY ("id")
                             )`)
    await queryRunner.query(`ALTER TABLE "products"
        ADD "typeId" integer`)
    await queryRunner.query(`ALTER TABLE "products"
        ADD CONSTRAINT "FK_6129aa5c0f65c073ea2f7452195" FOREIGN KEY ("typeId") REFERENCES "product_types" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products"
        DROP CONSTRAINT IF EXISTS "FK_6129aa5c0f65c073ea2f7452195"`)
    await queryRunner.query(`ALTER TABLE "products"
        DROP COLUMN IF EXISTS "typeId"`)
    await queryRunner.query('DROP TABLE IF EXISTS "product_types"')
  }

}
