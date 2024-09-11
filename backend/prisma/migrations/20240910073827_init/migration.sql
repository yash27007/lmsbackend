/*
  Warnings:

  - You are about to drop the column `instructorId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `CourseEnrollment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `manifestUrl` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scormVersion` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `scormUrl` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_studentId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "instructorId",
ADD COLUMN     "accessDuration" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discountPercentage" DOUBLE PRECISION,
ADD COLUMN     "discountValidUntil" TIMESTAMP(3),
ADD COLUMN     "discountedPrice" DOUBLE PRECISION,
ADD COLUMN     "facultyId" INTEGER,
ADD COLUMN     "manifestUrl" TEXT NOT NULL,
ADD COLUMN     "scormVersion" TEXT NOT NULL,
ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "scormUrl" SET NOT NULL;

-- DropTable
DROP TABLE "CourseEnrollment";

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "completionStatus" DOUBLE PRECISION,
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAccess" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "paymentMethod" TEXT,
    "enrollmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Enrollment_paid_createdAt_idx" ON "Enrollment"("paid", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_courseId_studentId_key" ON "Enrollment"("courseId", "studentId");

-- CreateIndex
CREATE INDEX "CourseAccess_expiresAt_idx" ON "CourseAccess"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CourseAccess_studentId_courseId_key" ON "CourseAccess"("studentId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_enrollmentId_key" ON "Payment"("enrollmentId");

-- CreateIndex
CREATE INDEX "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Admin_userId_idx" ON "Admin"("userId");

-- CreateIndex
CREATE INDEX "Course_facultyId_adminId_idx" ON "Course"("facultyId", "adminId");

-- CreateIndex
CREATE INDEX "Course_createdAt_updatedAt_idx" ON "Course"("createdAt", "updatedAt");

-- CreateIndex
CREATE INDEX "Course_price_discountedPrice_idx" ON "Course"("price", "discountedPrice");

-- CreateIndex
CREATE INDEX "Faculty_userId_idx" ON "Faculty"("userId");

-- CreateIndex
CREATE INDEX "Student_userId_idx" ON "Student"("userId");

-- CreateIndex
CREATE INDEX "User_email_role_idx" ON "User"("email", "role");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAccess" ADD CONSTRAINT "CourseAccess_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAccess" ADD CONSTRAINT "CourseAccess_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
