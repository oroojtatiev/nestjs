import {MigrationInterface, QueryRunner} from 'typeorm'

export class ProductType1667564834860 implements MigrationInterface {
  name = 'ProductType1667564834860'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "product_type" (
      "id"        SERIAL                NOT NULL,
      "name"      character varying(30) NOT NULL,
      "createdAt" TIMESTAMP             NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP             NOT NULL DEFAULT now(),
      "deletedAt" TIMESTAMP,
      CONSTRAINT "PK_6ad7b08e6491a02ebc9ed82019d" PRIMARY KEY ("id")
    )`)
    await queryRunner.query('ALTER TABLE "product" ADD "typeId" integer')
    await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_53bafe3ecc25867776c07c9e666" FOREIGN KEY ("typeId") REFERENCES "product_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_53bafe3ecc25867776c07c9e666"')
    await queryRunner.query('ALTER TABLE "product" DROP COLUMN "typeId"')
    await queryRunner.query('DROP TABLE "product_type"')
  }
}
