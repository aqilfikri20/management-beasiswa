-- CreateTable
CREATE TABLE `applicants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nik` VARCHAR(16) NOT NULL,
    `nama` VARCHAR(150) NOT NULL,
    `tempat_lahir` VARCHAR(100) NULL,
    `tanggal_lahir` DATETIME(3) NULL,
    `jenis_kelamin` VARCHAR(20) NULL,
    `alamat` TEXT NULL,
    `provinsi` VARCHAR(100) NULL,
    `kabupaten` VARCHAR(100) NULL,
    `kecamatan` VARCHAR(100) NULL,
    `kelurahan` VARCHAR(100) NULL,
    `no_hp` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `pendidikan` VARCHAR(100) NULL,
    `instansi` VARCHAR(150) NULL,
    `jurusan` VARCHAR(150) NULL,
    `pekerjaan` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `applicants_user_id_key`(`user_id`),
    UNIQUE INDEX `applicants_nik_key`(`nik`),
    INDEX `applicants_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `registrations` ADD CONSTRAINT `registrations_applicant_id_fkey` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
