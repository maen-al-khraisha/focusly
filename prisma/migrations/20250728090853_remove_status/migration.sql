/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `totalTime` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "finishedAt",
DROP COLUMN "status",
DROP COLUMN "totalTime";
