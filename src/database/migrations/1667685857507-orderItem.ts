import {MigrationInterface, QueryRunner} from 'typeorm'

export class orderItem1667685857507 implements MigrationInterface {
  name = 'orderItem1667685857507'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "order_item"
                             (
                               "id"        SERIAL  NOT NULL,
                               "quantity"  integer NOT NULL,
                               "orderId"   integer NOT NULL,
                               "productId" integer,
                               CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id")
                             )`)
    await queryRunner.query(`CREATE TABLE "order"
                             (
                               "id"        SERIAL    NOT NULL,
                               "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                               "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                               "deletedAt" TIMESTAMP,
                               "userId"    integer,
                               CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
                             )`)
    await queryRunner.query(`ALTER TABLE "product"
      ADD "quantity" integer`)
    await queryRunner.query(`ALTER TABLE IF EXISTS "order_item"
      ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE IF EXISTS "order_item"
      ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE IF EXISTS "order"
      ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE IF EXISTS "order"
      DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`)
    await queryRunner.query(`ALTER TABLE IF EXISTS "order_item"
      DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`)
    await queryRunner.query(`ALTER TABLE IF EXISTS "order_item"
      DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`)
    await queryRunner.query(`ALTER TABLE "product"
      DROP COLUMN "quantity"`)
    await queryRunner.query('DROP TABLE IF EXISTS "order"')
    await queryRunner.query('DROP TABLE IF EXISTS "order_item"')
  }

}
