-- CreateTable
CREATE TABLE `registrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicant_id` INTEGER NOT NULL,
    `program_id` INTEGER NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    `submitted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `registrations_applicant_id_idx`(`applicant_id`),
    INDEX `registrations_program_id_idx`(`program_id`),
    INDEX `registrations_status_idx`(`status`),
    UNIQUE INDEX `registrations_applicant_id_program_id_key`(`applicant_id`, `program_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administrative_selections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registration_id` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `score` DECIMAL(5, 2) NULL,
    `notes` TEXT NULL,
    `verified_by` INTEGER NULL,
    `verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `administrative_selections_registration_id_key`(`registration_id`),
    INDEX `administrative_selections_status_idx`(`status`),
    INDEX `administrative_selections_verified_by_idx`(`verified_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interview_selections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registration_id` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `scheduled_at` DATETIME(3) NULL,
    `score` DECIMAL(5, 2) NULL,
    `notes` TEXT NULL,
    `interviewer_id` INTEGER NULL,
    `interviewed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `interview_selections_registration_id_key`(`registration_id`),
    INDEX `interview_selections_status_idx`(`status`),
    INDEX `interview_selections_interviewer_id_idx`(`interviewer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `selection_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registration_id` INTEGER NOT NULL,
    `result` VARCHAR(20) NOT NULL,
    `final_score` DECIMAL(5, 2) NULL,
    `notes` TEXT NULL,
    `announced_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `selection_results_registration_id_key`(`registration_id`),
    INDEX `selection_results_result_idx`(`result`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `administrative_selections` ADD CONSTRAINT `administrative_selections_registration_id_fkey` FOREIGN KEY (`registration_id`) REFERENCES `registrations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interview_selections` ADD CONSTRAINT `interview_selections_registration_id_fkey` FOREIGN KEY (`registration_id`) REFERENCES `registrations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `selection_results` ADD CONSTRAINT `selection_results_registration_id_fkey` FOREIGN KEY (`registration_id`) REFERENCES `registrations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
