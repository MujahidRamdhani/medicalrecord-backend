-- CreateTable
CREATE TABLE `akun` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `role` ENUM('ADMINSISTEM', 'ADMINPELAYANAN', 'DOKTER', 'PASIEN') NOT NULL,
    `wallet` VARCHAR(10) NOT NULL DEFAULT 'FALSE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `akun_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminsistem` (
    `id` CHAR(36) NOT NULL,
    `id_akun` CHAR(36) NOT NULL,
    `idAdminSistem` CHAR(50) NULL,
    `nama` VARCHAR(200) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `adminsistem_id_akun_key`(`id_akun`),
    UNIQUE INDEX `adminsistem_idAdminSistem_key`(`idAdminSistem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminpelayanan` (
    `id` CHAR(36) NOT NULL,
    `id_akun` CHAR(36) NOT NULL,
    `nip_admin_pelayanan` CHAR(18) NULL,
    `nama` VARCHAR(200) NOT NULL,
    `jenisKelamin` ENUM('LAKILAKI', 'PEREMPUAN') NOT NULL,
    `alamat` TEXT NOT NULL,
    `nomor_telepon` VARCHAR(20) NOT NULL,
    `idPelayananKesehatan` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `adminpelayanan_id_akun_key`(`id_akun`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelayanankesehatan` (
    `id` CHAR(36) NOT NULL,
    `kodePelayanan` CHAR(16) NULL,
    `nama` VARCHAR(200) NOT NULL,
    `tipe` ENUM('RUMAHSAKIT', 'PUSKESMAS', 'KLINIK') NOT NULL,
    `alamat` TEXT NOT NULL,
    `nomor_telepon` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pelayanankesehatan_kodePelayanan_key`(`kodePelayanan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokter` (
    `id` CHAR(36) NOT NULL,
    `id_akun` CHAR(36) NOT NULL,
    `nip` CHAR(18) NULL,
    `nama` VARCHAR(200) NOT NULL,
    `jenisKelamin` ENUM('LAKILAKI', 'PEREMPUAN') NOT NULL,
    `spesialis` ENUM('UMUM', 'ANAK', 'KANDUNGAN', 'GIGI', 'PSIKOLOG', 'UROLOGI', 'JANTUNG', 'SARAF', 'THT', 'JIWA', 'PENYAKITDALAM', 'KULIT', 'MATA', 'PARU', 'GINJAL', 'REHABILITAS', 'ALERGI', 'HIPNOTERAPIS', 'BEDAH', 'GIZI') NOT NULL,
    `alamat` TEXT NOT NULL,
    `nomor_telepon` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `idPelayananKesehatan` CHAR(36) NULL,

    UNIQUE INDEX `dokter_id_akun_key`(`id_akun`),
    UNIQUE INDEX `dokter_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pasien` (
    `id` CHAR(36) NOT NULL,
    `id_akun` CHAR(36) NOT NULL,
    `nik` CHAR(16) NULL,
    `noRM` VARCHAR(19) NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `jenisKelamin` ENUM('LAKILAKI', 'PEREMPUAN') NOT NULL,
    `tempatLahir` VARCHAR(50) NOT NULL,
    `tanggalLahir` DATE NOT NULL,
    `alamat` TEXT NOT NULL,
    `agama` ENUM('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KONGHUCU') NOT NULL,
    `golonganDarah` ENUM('TIDAKADA', 'A', 'B', 'AB', 'O') NOT NULL,
    `pekerjaan` VARCHAR(40) NOT NULL,
    `kewarganegaraan` ENUM('WNI', 'WNA') NOT NULL,
    `nomor_telepon` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `idPelayananKesehatan` CHAR(36) NULL,

    UNIQUE INDEX `pasien_id_akun_key`(`id_akun`),
    UNIQUE INDEX `pasien_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `janjitemupasien` (
    `id` CHAR(36) NOT NULL,
    `nikPasien` VARCHAR(191) NULL,
    `nipDokter` VARCHAR(191) NULL,
    `tanggalTemu` DATETIME(3) NOT NULL,
    `selesai` ENUM('Selesai', 'BelumSelesai') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `sid` VARCHAR(191) NOT NULL,
    `data` TEXT NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `session_sid_key`(`sid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `adminsistem` ADD CONSTRAINT `adminsistem_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminpelayanan` ADD CONSTRAINT `adminpelayanan_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminpelayanan` ADD CONSTRAINT `adminpelayanan_idPelayananKesehatan_fkey` FOREIGN KEY (`idPelayananKesehatan`) REFERENCES `pelayanankesehatan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokter` ADD CONSTRAINT `dokter_idPelayananKesehatan_fkey` FOREIGN KEY (`idPelayananKesehatan`) REFERENCES `pelayanankesehatan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokter` ADD CONSTRAINT `dokter_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pasien` ADD CONSTRAINT `pasien_idPelayananKesehatan_fkey` FOREIGN KEY (`idPelayananKesehatan`) REFERENCES `pelayanankesehatan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pasien` ADD CONSTRAINT `pasien_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `janjitemupasien` ADD CONSTRAINT `janjitemupasien_nikPasien_fkey` FOREIGN KEY (`nikPasien`) REFERENCES `pasien`(`nik`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `janjitemupasien` ADD CONSTRAINT `janjitemupasien_nipDokter_fkey` FOREIGN KEY (`nipDokter`) REFERENCES `dokter`(`nip`) ON DELETE SET NULL ON UPDATE CASCADE;
