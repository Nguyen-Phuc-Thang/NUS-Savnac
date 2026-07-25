-- CreateTable
CREATE TABLE "Reminder" (
    "reminderId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "remindAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("reminderId")
);

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;
