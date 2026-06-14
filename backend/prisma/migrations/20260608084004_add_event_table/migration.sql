-- CreateTable
CREATE TABLE "Event" (
    "eventId" UUID NOT NULL,
    "courseId" UUID,
    "title" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "venue" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE SET NULL ON UPDATE CASCADE;
