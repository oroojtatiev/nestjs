import {MigrationInterface, QueryRunner} from 'typeorm'

export class ColumnNameUnderlined1678187703032 implements MigrationInterface {
    name = 'ColumnNameUnderlined1678187703032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_53bafe3ecc25867776c07c9e666"')
        await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6"')
        await queryRunner.query('ALTER TABLE "product_type" DROP COLUMN "createdAt"')
        await queryRunner.query('ALTER TABLE "product_type" DROP COLUMN "updatedAt"')
        await queryRunner.query('ALTER TABLE "product_type" DROP COLUMN "deletedAt"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "typeId"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "brandId"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "createdAt"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "updatedAt"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "deletedAt"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "isPublished"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "inStock"')
        await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "createdAt"')
        await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "updatedAt"')
        await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "deletedAt"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "tokenExpire"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "isEmailConfirmed"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "createdAt"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "updatedAt"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "deletedAt"')
        await queryRunner.query('ALTER TABLE "payment" DROP COLUMN "transactionId"')
        await queryRunner.query('ALTER TABLE "payment" DROP COLUMN "createdAt"')
        await queryRunner.query('ALTER TABLE "payment" DROP COLUMN "deletedAt"')
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "createdAt"')
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "updatedAt"')
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "deletedAt"')
        await queryRunner.query('ALTER TABLE "product_type" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product_type" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product_type" ADD "deleted_at" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "product" ADD "in_stock" boolean')
        await queryRunner.query('ALTER TABLE "product" ADD "is_published" boolean NOT NULL DEFAULT false')
        await queryRunner.query('ALTER TABLE "product" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product" ADD "deleted_at" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "product" ADD "type_id" integer')
        await queryRunner.query('ALTER TABLE "product" ADD "brand_id" integer')
        await queryRunner.query('ALTER TABLE "brand" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "brand" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "brand" ADD "deleted_at" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "user" ADD "token_expire" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "user" ADD "is_email_confirmed" boolean NOT NULL DEFAULT false')
        await queryRunner.query('ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "user" ADD "updated_at" TIMESTAMP DEFAULT now()')
        await queryRunner.query('ALTER TABLE "user" ADD "deleted_at" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "payment" ADD "transaction_id" character varying(25) NOT NULL')
        await queryRunner.query('ALTER TABLE "payment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "payment" ADD "deleted_at" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "order" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "order" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "order" ADD "deleted_at" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_e0843930fbb8854fe36ca39dae1" FOREIGN KEY ("type_id") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
        await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_2eb5ce4324613b4b457c364f4a2" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_2eb5ce4324613b4b457c364f4a2"')
        await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_e0843930fbb8854fe36ca39dae1"')
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "deleted_at"')
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "updated_at"')
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "created_at"')
        await queryRunner.query('ALTER TABLE "payment" DROP COLUMN "deleted_at"')
        await queryRunner.query('ALTER TABLE "payment" DROP COLUMN "created_at"')
        await queryRunner.query('ALTER TABLE "payment" DROP COLUMN "transaction_id"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "deleted_at"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "updated_at"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "created_at"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "is_email_confirmed"')
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "token_expire"')
        await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "deleted_at"')
        await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "updated_at"')
        await queryRunner.query('ALTER TABLE "brand" DROP COLUMN "created_at"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "brand_id"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "type_id"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "deleted_at"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "updated_at"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "created_at"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "is_published"')
        await queryRunner.query('ALTER TABLE "product" DROP COLUMN "in_stock"')
        await queryRunner.query('ALTER TABLE "product_type" DROP COLUMN "deleted_at"')
        await queryRunner.query('ALTER TABLE "product_type" DROP COLUMN "updated_at"')
        await queryRunner.query('ALTER TABLE "product_type" DROP COLUMN "created_at"')
        await queryRunner.query('ALTER TABLE "order" ADD "deletedAt" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "order" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "order" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "payment" ADD "deletedAt" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "payment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "payment" ADD "transactionId" character varying(25) NOT NULL')
        await queryRunner.query('ALTER TABLE "user" ADD "deletedAt" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "user" ADD "updatedAt" TIMESTAMP DEFAULT now()')
        await queryRunner.query('ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "user" ADD "isEmailConfirmed" boolean NOT NULL DEFAULT false')
        await queryRunner.query('ALTER TABLE "user" ADD "tokenExpire" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "brand" ADD "deletedAt" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "brand" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "brand" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product" ADD "inStock" boolean')
        await queryRunner.query('ALTER TABLE "product" ADD "isPublished" boolean NOT NULL DEFAULT false')
        await queryRunner.query('ALTER TABLE "product" ADD "deletedAt" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "product" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product" ADD "brandId" integer')
        await queryRunner.query('ALTER TABLE "product" ADD "typeId" integer')
        await queryRunner.query('ALTER TABLE "product_type" ADD "deletedAt" TIMESTAMP')
        await queryRunner.query('ALTER TABLE "product_type" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product_type" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()')
        await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
        await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_53bafe3ecc25867776c07c9e666" FOREIGN KEY ("typeId") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    }

}
