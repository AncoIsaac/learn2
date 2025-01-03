/*
  Warnings:

  - You are about to drop the `_InventoryToPerson` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_InventoryToPerson" DROP CONSTRAINT "_InventoryToPerson_A_fkey";

-- DropForeignKey
ALTER TABLE "_InventoryToPerson" DROP CONSTRAINT "_InventoryToPerson_B_fkey";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_InventoryToPerson";

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
