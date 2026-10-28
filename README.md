# Sistem Manajemen Media-Zefanya v1 (Skripsi)

Aplikasi web untuk manajemen data skripsi mahasiswa yang terhubung langsung ke Supabase. Proyek ini dibuat untuk kebutuhan pengelolaan data akademik dengan verifikasi guru dan antarmuka interaktif.

## Fitur Utama

- **Manajemen Skripsi** - Tambah, edit, hapus, dan lihat data skripsi mahasiswa lengkap dengan judul, penulis, pembimbing, dan status.
- **Skor & Penilaian** - Penginputan nilai/skor dengan rentang validasi 1-100.
- **Pencarian & Pengurutan** - State `searchQuery` dinamis dan toggle sorting data secara real-time.
- **Mode Guru** - Fitur verifikasi khusus guru menggunakan password (`zefanya123`) untuk aksi administratif tertentu.
- **Sinkronisasi Supabase** - Seluruh data tersimpan secara terpusat di proyek Supabase `dytcoemthbngxoamoetr` tabel `skripsi`.

## Tech Stack

- Frontend: HTML5, CSS3 / Tailwind, JavaScript (Vanilla/React sesuai arsitektur app)
- Backend / Database: Supabase PostgreSQL
- Deployment Lokal: PM2 Process Manager (Port 8080)

## Perbandingan Versi Media-Zefanya (v1, v2, v3)

| Versi | Nama Proyek / Topik | Tabel Supabase | Port PM2 | Repository GitHub | Deskripsi Singkat |
|---|---|---|---|---|---|
| **v1** | Skripsi | `skripsi` | 8080 | `Carelyk/Media-Zefanya` | Manajemen data skripsi & nilai mahasiswa |
| **v2** | Buku | `buku` | 8081 | `Carelyk/Media-Zefanya-v2` | Manajemen inventaris perpustakaan dan buku |
| **v3** | Taman | `taman` | 8082 | `Carelyk/Media-Zefanya-v3` | Manajemen data fasilitas taman kota & tanaman |
