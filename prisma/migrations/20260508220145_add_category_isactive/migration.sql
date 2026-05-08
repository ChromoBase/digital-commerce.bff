-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Category_storeId_isActive_idx" ON "Category"("storeId", "isActive");
