import {MigrationInterface, QueryRunner} from 'typeorm'

export class Brand1678532894918 implements MigrationInterface {
  name = 'Brand1678532894918'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "brand" (
      "id"         SERIAL                NOT NULL,
      "name"       character varying(30) NOT NULL,
      "created_at" TIMESTAMP             NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP             NOT NULL DEFAULT now(),
      "deleted_at" TIMESTAMP,
      CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id")
    )`)
    await queryRunner.query('ALTER TABLE "product" ADD "brand_id" integer')
    await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_2eb5ce4324613b4b457c364f4a2" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_2eb5ce4324613b4b457c364f4a2"')
    await queryRunner.query('ALTER TABLE "product" DROP COLUMN "brand_id"')
    await queryRunner.query('DROP TABLE "brand"')
  }
}
