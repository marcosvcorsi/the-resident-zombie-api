-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "survivorId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_survivorId_fkey" FOREIGN KEY ("survivorId") REFERENCES "survivors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
