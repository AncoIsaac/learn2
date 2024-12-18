-- CreateTable
CREATE TABLE "Werehouse" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "locationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Werehouse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Werehouse" ADD CONSTRAINT "Werehouse_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
