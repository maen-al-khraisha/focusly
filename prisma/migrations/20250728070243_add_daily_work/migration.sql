-- CreateTable
CREATE TABLE "DailyWork" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyWork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyWork_taskId_date_key" ON "DailyWork"("taskId", "date");

-- AddForeignKey
ALTER TABLE "DailyWork" ADD CONSTRAINT "DailyWork_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
