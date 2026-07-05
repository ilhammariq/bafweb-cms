-- CreateTable
CREATE TABLE "teams_members" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "role" VARCHAR(20),
    "is_active" BOOLEAN DEFAULT true,
    "usr_crt" UUID,
    "usr_upd" UUID,
    "dtm_crt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_upd" TEXT NOT NULL DEFAULT now(),

    CONSTRAINT "teams_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_members_team_id_member_id_key" ON "teams_members"("team_id", "member_id");

-- AddForeignKey
ALTER TABLE "teams_members" ADD CONSTRAINT "teams_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams_members" ADD CONSTRAINT "teams_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
