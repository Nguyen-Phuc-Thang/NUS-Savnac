-- CreateTable
CREATE TABLE "Pomodoro" (
    "pomodoroId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "focusTime" INTEGER NOT NULL,
    "breakTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "Pomodoro_pkey" PRIMARY KEY ("pomodoroId")
);

-- AddForeignKey
ALTER TABLE "Pomodoro" ADD CONSTRAINT "Pomodoro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
