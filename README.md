# Media-Zefanya v1 (Skripsi)

Aplikasi manajemen data skripsi mahasiswa yang terhubung langsung ke Supabase (`dytcoemthbngxoamoetr`).

## Fitur Utama
- CRUD data skripsi mahasiswa.
- Skor/nilai 1-100.
- Toggle sorting & search query state.
- Mode verifikasi guru (password: `zefanya123`).

## Perbedaan v1, v2, v3
| Versi | Target Entitas | Tabel Supabase | Port PM2 |
|---|---|---|---|
| **v1** | Skripsi | `skripsi` | 8080 |
| **v2** | Buku | `buku` | 8081 |
| **v3** | Taman | `taman` | 8082 |
