import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllTables1644410211539 implements MigrationInterface {
  name = 'CreateAllTables1644410211539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "business" ("id" uuid NOT NULL, "name" character varying NOT NULL, "total_transaction_amount_threshold" integer NOT NULL, CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."app_user_role_enum" AS ENUM('VIEWER', 'APPROVER')`);
    await queryRunner.query(
      `CREATE TABLE "app_user" ("id" uuid NOT NULL, "name" character varying NOT NULL, "role" "public"."app_user_role_enum" NOT NULL DEFAULT 'VIEWER', "business_id" uuid NOT NULL, "disbursement_permission" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_22a5c4a3d9b2fb8e4e73fc4ada1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."batch_disbursement_status_enum" AS ENUM('NEEDS_APPROVAL', 'NEEDS_SECOND_APPROVAL', 'PENDING')`
    );
    await queryRunner.query(
      `CREATE TABLE "batch_disbursement" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "reference" character varying NOT NULL, "total_uploaded_amount" integer NOT NULL, "total_uploaded_count" integer NOT NULL, "status" "public"."batch_disbursement_status_enum" NOT NULL DEFAULT 'NEEDS_APPROVAL', "uploader_id" uuid NOT NULL, "business_id" uuid NOT NULL, CONSTRAINT "PK_c3a75fba815abfa440cf058830c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."bd_approval_type_enum" AS ENUM('FIRST_LEVEL', 'SECOND_LEVEL')`);
    await queryRunner.query(
      `CREATE TABLE "bd_approval" ("id" uuid NOT NULL, "approver_id" uuid NOT NULL, "type" "public"."bd_approval_type_enum" NOT NULL DEFAULT 'FIRST_LEVEL', "approved_at" TIMESTAMP NOT NULL DEFAULT now(), "batch_disbursement_id" uuid, CONSTRAINT "PK_eeda0a0f48f0cc9055dfc9cca1c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "app_user" ADD CONSTRAINT "FK_9d8d75203738da030373f8a4245" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "batch_disbursement" ADD CONSTRAINT "FK_4d03162d80000376e1692cc7845" FOREIGN KEY ("uploader_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "batch_disbursement" ADD CONSTRAINT "FK_d798a896689814e665542929962" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "bd_approval" ADD CONSTRAINT "FK_927aeaba5c405c3278cdbd2260d" FOREIGN KEY ("approver_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "bd_approval" ADD CONSTRAINT "FK_25942dd38a0c8bdab3c84f85a50" FOREIGN KEY ("batch_disbursement_id") REFERENCES "batch_disbursement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bd_approval" DROP CONSTRAINT "FK_25942dd38a0c8bdab3c84f85a50"`);
    await queryRunner.query(`ALTER TABLE "bd_approval" DROP CONSTRAINT "FK_927aeaba5c405c3278cdbd2260d"`);
    await queryRunner.query(`ALTER TABLE "batch_disbursement" DROP CONSTRAINT "FK_d798a896689814e665542929962"`);
    await queryRunner.query(`ALTER TABLE "batch_disbursement" DROP CONSTRAINT "FK_4d03162d80000376e1692cc7845"`);
    await queryRunner.query(`ALTER TABLE "app_user" DROP CONSTRAINT "FK_9d8d75203738da030373f8a4245"`);
    await queryRunner.query(`DROP TABLE "bd_approval"`);
    await queryRunner.query(`DROP TYPE "public"."bd_approval_type_enum"`);
    await queryRunner.query(`DROP TABLE "batch_disbursement"`);
    await queryRunner.query(`DROP TYPE "public"."batch_disbursement_status_enum"`);
    await queryRunner.query(`DROP TABLE "app_user"`);
    await queryRunner.query(`DROP TYPE "public"."app_user_role_enum"`);
    await queryRunner.query(`DROP TABLE "business"`);
  }
}
