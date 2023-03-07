import { MigrationInterface, QueryRunner } from "typeorm";

export class ColumnNameUnderlined1678182084627 implements MigrationInterface {
    name = 'ColumnNameUnderlined1678182084627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_type" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "product_type" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "product_type" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "inStock"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isPublished"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailConfirmed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokenExpire"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product" ADD "in_stock" boolean`);
        await queryRunner.query(`ALTER TABLE "product" ADD "is_published" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "token_expire" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_email_confirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "transaction_id" character varying(25) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_email_confirmed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token_expire"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "is_published"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "in_stock"`);
        await queryRunner.query(`ALTER TABLE "product_type" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "product_type" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_type" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "transactionId" character varying(25) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tokenExpire" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isEmailConfirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brand" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product" ADD "isPublished" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "inStock" boolean`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_type" ADD "deletedAt" TIMESTAMP`);
    }

}
