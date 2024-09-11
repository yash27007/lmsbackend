/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - Made the column `accessDuration` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `scormVersion` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'FACULTY', 'ADMIN');

-- CreateEnum
CREATE TYPE "ScormVersion" AS ENUM ('SCORM_1_2', 'SCORM_2004_3RD_EDITION', 'SCORM_2004_4TH_EDITION');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "accessDuration" SET NOT NULL,
ALTER COLUMN "accessDuration" SET DEFAULT 365,
DROP COLUMN "scormVersion",
ADD COLUMN     "scormVersion" "ScormVersion" NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE INDEX "User_email_role_idx" ON "User"("email", "role");
