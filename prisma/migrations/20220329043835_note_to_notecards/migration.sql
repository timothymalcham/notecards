/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "Notecard" (
    "id" TEXT NOT NULL,
    "sideOne" TEXT NOT NULL,
    "sideTwo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notecard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notecard" ADD CONSTRAINT "Notecard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
