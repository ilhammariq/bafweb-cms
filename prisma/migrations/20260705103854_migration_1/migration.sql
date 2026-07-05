/*
  Warnings:

  - You are about to drop the column `role` on the `teams_members` table. All the data in the column will be lost.
  - Added the required column `role_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "role_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "teams_members" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "usr_crt" UUID,
    "usr_upd" UUID,
    "dtm_crt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_upd" TEXT NOT NULL DEFAULT now(),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
