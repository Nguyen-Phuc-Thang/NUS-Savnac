/*
  Warnings:

  - A unique constraint covering the columns `[courseId,title,week,day,startTime,endTime]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Event_courseId_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Event_courseId_title_week_day_startTime_endTime_key" ON "Event"("courseId", "title", "week", "day", "startTime", "endTime");
