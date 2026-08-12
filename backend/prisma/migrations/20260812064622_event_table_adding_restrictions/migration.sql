/*
  Warnings:

  - A unique constraint covering the columns `[courseId,title]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_courseId_title_key" ON "Event"("courseId", "title");
