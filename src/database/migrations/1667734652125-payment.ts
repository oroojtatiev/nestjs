import {MigrationInterface, QueryRunner} from 'typeorm'

export class payment1667734652125 implements MigrationInterface {
  name = 'payment1667734652125'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "payment"
                             (
                               "id"            SERIAL                NOT NULL,
                               "transactionId" character varying(25) NOT NULL,
                               "paymentType"   character varying     NOT NULL,
                               "createdAt"     TIMESTAMP             NOT NULL DEFAULT now(),
                               "deletedAt"     TIMESTAMP,
                               "orderId"       integer,
                               CONSTRAINT "REL_d09d285fe1645cd2f0db811e29" UNIQUE ("orderId"),
                               CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id")
                             )`)
    await queryRunner.query(`ALTER TABLE "order"
      DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`)
    await queryRunner.query(`ALTER TABLE "order"
      ALTER COLUMN "userId" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "order_item"
      DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`)
    await queryRunner.query(`ALTER TABLE "order_item"
      ALTER COLUMN "productId" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE IF EXISTS "payment"
      ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "order"
      ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "order_item"
      ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_item"
      DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`)
    await queryRunner.query(`ALTER TABLE "order"
      DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`)
    await queryRunner.query(`ALTER TABLE IF EXISTS "payment"
      DROP CONSTRAINT IF EXISTS "FK_d09d285fe1645cd2f0db811e293"`)
    await queryRunner.query(`ALTER TABLE "order_item"
      ALTER COLUMN "productId" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "order_item"
      ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "order"
      ALTER COLUMN "userId" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "order"
      ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query('DROP TABLE IF EXISTS "payment"')
  }

}
