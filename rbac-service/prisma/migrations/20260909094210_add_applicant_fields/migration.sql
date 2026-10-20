/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `email_verified_at` DATETIME(3) NULL,
    ADD COLUMN `last_login_at` DATETIME(3) NULL,
    ADD COLUMN `nik` VARCHAR(16) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_nik_key` ON `users`(`nik`);
