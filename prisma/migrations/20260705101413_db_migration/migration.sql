-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL,
    "team_name" VARCHAR(25) NOT NULL,
    "team_desc" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "usr_crt" UUID,
    "usr_upd" UUID,
    "dtm_crt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_upd" TEXT NOT NULL DEFAULT now(),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "member_name" VARCHAR(25) NOT NULL,
    "member_email" VARCHAR(50) NOT NULL,
    "avatar" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "usr_crt" UUID,
    "usr_upd" UUID,
    "dtm_crt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_upd" TEXT NOT NULL DEFAULT now(),

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_member_email_key" ON "members"("member_email");
