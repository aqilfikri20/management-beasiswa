# Platform Beasiswa

Aplikasi web untuk mengelola proses beasiswa, mulai dari publikasi program dan pendaftaran peserta hingga seleksi dan pengelolaan dokumen. Sistem menggunakan arsitektur layanan terpisah agar fungsi autentikasi, data program, transaksi pendaftaran, dan dokumen dapat dikelola secara modular.

## Kegunaan

- Menampilkan informasi dan persyaratan program beasiswa.
- Mengelola akun pengguna, autentikasi, peran, dan hak akses.
- Mencatat pendaftar serta tahapan seleksi administrasi, wawancara, dan hasil seleksi.
- Mengunggah dan mengelola dokumen pendaftaran, dengan pemindaian antivirus melalui ClamAV.
- Menyediakan antarmuka untuk pendaftar dan petugas internal.

## Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, Bootstrap.
- **Backend:** Node.js 22, Express 5, TypeScript, Prisma ORM.
- **Gateway:** Express dan `http-proxy-middleware` sebagai pintu masuk API.
- **Database:** MySQL 8.4 untuk RBAC, data master, dan transaksi; PostgreSQL 16 untuk dokumen.
- **Infrastruktur:** Docker, Docker Compose, Nginx untuk frontend, dan ClamAV untuk pemindaian berkas.

## Persyaratan

- Git
- Docker Desktop (atau Docker Engine) dengan Docker Compose v2

## Clone dan jalankan dengan Docker

Clone repository, lalu masuk ke direktori proyek:

```bash
git clone <URL-REPOSITORY>
cd <NAMA-DIREKTORI-REPOSITORY>
```

Build image dan jalankan semua service di latar belakang:

```bash
docker compose up --build -d
```

Perintah pertama dapat memerlukan waktu karena Docker perlu mengunduh image dan memasang dependensi aplikasi. Untuk melihat status container dan log:

```bash
docker compose ps
docker compose logs -f
```

Setelah service berjalan, buka frontend di [http://localhost:5173](http://localhost:5173). API Gateway tersedia di [http://localhost:3000](http://localhost:3000).

Untuk menghentikan seluruh service:

```bash
docker compose down
```

> Data database dan berkas yang diunggah disimpan di Docker volumes sehingga tetap ada setelah container dihentikan. Untuk menghapus container sekaligus seluruh data volume, gunakan `docker compose down -v`.

## Service dan port internal

| Service | Fungsi | Port internal |
| --- | --- | ---: |
| `frontend` | Antarmuka pengguna, disajikan oleh Nginx | 80 (host: 5173) |
| `gateway` | Pintu masuk dan pengarah request API | 3000 |
| `rbac-service` | Autentikasi, pengguna, peran, menu, dan izin | 3001 |
| `master-service` | Data program dan persyaratan beasiswa | 3002 |
| `transaction-service` | Pendaftar, pendaftaran, dan proses seleksi | 3003 |
| `document-service` | Penyimpanan dan pemindaian dokumen | 3004 |
| `clamav` | Pemindaian berkas terhadap malware | 3310 |

> Dalam konfigurasi Compose saat ini, hanya frontend (`localhost:5173`) dan API Gateway (`localhost:3000`) yang dipublikasikan ke host. Database dan service backend berkomunikasi melalui jaringan Docker internal.

## Konfigurasi

Variabel lingkungan layanan untuk Docker saat ini didefinisikan langsung di `docker-compose.yml`. Nilai password dan secret yang ada ditujukan untuk pengembangan lokal; ganti dengan nilai yang aman sebelum digunakan di lingkungan lain. Jangan gunakan secret bawaan untuk deployment publik.

## Struktur repository

```text
frontend/              Aplikasi web React
gateway/               API Gateway
rbac-service/          Autentikasi dan manajemen hak akses
master-service/        Data master program beasiswa
transaction-service/   Pendaftaran dan proses seleksi
document-service/      Pengelolaan dokumen
docker-compose.yml     Definisi service, database, network, dan volume
```
