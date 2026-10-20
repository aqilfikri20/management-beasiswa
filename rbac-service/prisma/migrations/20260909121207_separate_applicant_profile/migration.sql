/*
  Warnings:

  - You are about to drop the column `nik` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `users_nik_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `nik`;

-- CreateTable
CREATE TABLE `applicants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nik` VARCHAR(16) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `applicants_user_id_key`(`user_id`),
    UNIQUE INDEX `applicants_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `applicants` ADD CONSTRAINT `applicants_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
