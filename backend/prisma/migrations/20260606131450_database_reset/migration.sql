-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('CUSTOM', 'NUS');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingUser" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "courseId" UUID NOT NULL,
    "courseCode" TEXT,
    "courseTitle" TEXT NOT NULL,
    "courseType" "CourseType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "Folder" (
    "folderId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("folderId")
);

-- CreateTable
CREATE TABLE "Link" (
    "linkId" UUID NOT NULL,
    "folderId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("linkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_email_key" ON "PendingUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_userId_courseCode_key" ON "Course"("userId", "courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_courseId_name_key" ON "Folder"("courseId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Link_folderId_title_key" ON "Link"("folderId", "title");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("folderId") ON DELETE RESTRICT ON UPDATE CASCADE;
