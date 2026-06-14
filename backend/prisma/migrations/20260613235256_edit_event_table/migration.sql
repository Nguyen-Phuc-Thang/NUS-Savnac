/*
  Warnings:

  - The values [NUS,NONNUS] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('CLASS', 'DEADLINE', 'OTHERS');
ALTER TABLE "Event" ALTER COLUMN "eventType" TYPE "EventType_new" USING ("eventType"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "userId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
