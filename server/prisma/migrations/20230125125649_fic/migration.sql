/*
  Warnings:

  - A unique constraint covering the columns `[day_id,habit_id]` on the table `days_habits` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "days_habits_day_id_habit_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "days_habits_day_id_habit_id_key" ON "days_habits"("day_id", "habit_id");
