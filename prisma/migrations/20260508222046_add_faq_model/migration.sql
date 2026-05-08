-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FAQ_storeId_isActive_idx" ON "FAQ"("storeId", "isActive");

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
