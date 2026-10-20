-- AlterTable
ALTER TABLE `applicants` ADD COLUMN `alamat` TEXT NULL,
    ADD COLUMN `instansi` VARCHAR(200) NULL,
    ADD COLUMN `jenis_kelamin` VARCHAR(1) NULL,
    ADD COLUMN `jurusan` VARCHAR(200) NULL,
    ADD COLUMN `kabupaten` VARCHAR(100) NULL,
    ADD COLUMN `kecamatan` VARCHAR(100) NULL,
    ADD COLUMN `kelurahan` VARCHAR(100) NULL,
    ADD COLUMN `no_hp` VARCHAR(20) NULL,
    ADD COLUMN `pekerjaan` VARCHAR(150) NULL,
    ADD COLUMN `pendidikan` VARCHAR(100) NULL,
    ADD COLUMN `provinsi` VARCHAR(100) NULL,
    ADD COLUMN `tanggal_lahir` DATETIME(3) NULL,
    ADD COLUMN `tempat_lahir` VARCHAR(100) NULL;
