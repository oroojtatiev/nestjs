import {MigrationInterface, QueryRunner} from 'typeorm'

export class products1667419192828 implements MigrationInterface {
  name = 'products1667419192828'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "products"
                             (
                                 "id"          SERIAL                NOT NULL,
                                 "serial"      character varying(15) NOT NULL,
                                 "title"       character varying(55) NOT NULL,
                                 "scale"       character varying(6),
                                 "weight"      integer               NOT NULL,
                                 "image"       character varying(55),
                                 "price"       integer               NOT NULL,
                                 "inStock"     boolean,
                                 "isPublished" boolean               NOT NULL DEFAULT false,
                                 "views"       integer               NOT NULL DEFAULT '0',
                                 "createdAt"   TIMESTAMP             NOT NULL DEFAULT now(),
                                 "updatedAt"   TIMESTAMP             NOT NULL DEFAULT now(),
                                 "deletedAt"   TIMESTAMP,
                                 CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
                             )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "products"')
  }

}
