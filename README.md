# 🎓 SIMATKUL Backend (RESTful API)

> **Backend Service untuk Sistem Informasi Pengaturan Mata Kuliah**  
> Dibangun dengan arsitektur berlapis (*Layered Architecture*) modern, modular, dan menerapkan praktik industri yang *scalable*, *type-safe*, serta *maintainable*.

---

## 📌 Tentang Proyek

**SIMATKUL-BE** merupakan layanan backend API yang menangani seluruh proses bisnis pengaturan dan manajemen mata kuliah (jadwal, kelas, dosen, kurikulum, dan otentikasi pengguna).

Proyek ini menerapkan standar industri terkini untuk membangun backend yang tangguh:
- **Scalable Layered Architecture:** Pemisahan tanggung jawab yang jelas antara **Routes**, **Controllers**, **Services**, **Repositories**, dan **Validations**.
- **Data Integrity & Type Safety:** Validasi skema runtime yang ketat menggunakan **Zod**.
- **Modern ORM Performance:** Akses database PostgreSQL berkecepatan tinggi menggunakan **Drizzle ORM**.
- **Secure Authentication:** Autentikasi dan autorisasi berbasis **JSON Web Token (JWT)**.
- **Resilient Connection:** Manajemen koneksi *Connection Pool* PostgreSQL yang andal dan mendukung database *cloud* (Aiven/Supabase/Neon) maupun *local*.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) (ES Modules) | Eksekusi JavaScript backend modern dan asynchronous |
| **Framework** | [Express.js v5](https://expressjs.com/) | Web framework minimalis dan fleksibel untuk REST API |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Relational Database Management System (RDBMS) |
| **ORM / Driver** | [Drizzle ORM](https://orm.drizzle.team/) & `pg` | TypeScript/JavaScript ORM performa tinggi dengan pool connection |
| **Data Validation**| [Zod](https://zod.dev/) | Skema validasi runtime deklaratif dan type-safe |
| **Security** | [JSON Web Token (JWT)](https://jwt.io/), `cors` | Token otentikasi dan kontrol CORS lintas domain |
| **Dev Tools** | [Nodemon](https://nodemon.io/), [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) | Live-reload development server dan database schema migrator |
| **Package Manager** | [PNPM](https://pnpm.io/) | Pengelola dependensi yang cepat dan hemat ruang disk |

---

## 🏗️ Struktur Direktori

Arsitektur direktori diatur secara modular untuk memudahkan eskalasi fitur dan kerja tim:

```text
simatkul-be/
├── config/             # Konfigurasi aplikasi (Database Pool, Environment Variables, dsb)
│   ├── database.js     # Inisialisasi Drizzle ORM & PostgreSQL connection pool
│   └── env.js          # Loading & mapping environment variables
├── controllers/        # Request & Response handling (HTTP Layer)
├── middleware/         # Middleware (Auth JWT, Error Handler, Logger, dsb)
├── repositories/       # Data Access Layer (Query Drizzle ORM ke PostgreSQL)
├── routes/             # Definisi endpoint RESTful API
├── services/           # Business Logic Layer
├── utils/              # Helper functions & utilities
├── validation/         # Skema validasi payload request (Zod Schemas)
├── .env.development.local # Environment file untuk development lokal
├── .env.example        # Template konfigurasi environment variables
├── package.json        # Manifest dependensi & scripts
├── server.js           # Entry point utama aplikasi Express
├── LICENSE             # Lisensi Open Source (MIT)
└── README.md           # Dokumentasi proyek
```

---

## 🚀 Panduan Menjalankan Proyek (Step-by-Step)

Ikuti langkah-langkah berikut untuk meng-clone dan menjalankan proyek di mesin lokal Anda:

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
- **Git** ([Unduh Git](https://git-scm.com/))
- **Node.js** versi 18 LTS atau lebih baru ([Unduh Node.js](https://nodejs.org/))
- **PNPM** (disarankan) atau **NPM** / **Yarn** / **Bun**
- Instance **PostgreSQL** (Lokal atau Cloud seperti Supabase, Neon, Aiven)

### 2. Clone Repository & Masuk ke Direktori Proyek

Buka terminal / command prompt dan jalankan:

```bash
# Clone repository
git clone https://github.com/Arropi/simatkul-be.git

# Masuk ke direktori proyek
cd simatkul-be
```

### 3. Instalasi Dependensi

Install seluruh package dan dependensi yang dibutuhkan:

```bash
# Menggunakan PNPM (Sangat Disarankan)
pnpm install

# Atau menggunakan NPM
npm install

# Atau menggunakan Yarn
yarn install

# Atau menggunakan Bun
bun install
```

### 4. Konfigurasi Environment Variables

Salin template konfigurasi `.env.example` ke file `.env.development.local`:

```bash
# Untuk Linux / macOS / Git Bash
cp .env.example .env.development.local

# Untuk Windows (Command Prompt / PowerShell)
copy .env.example .env.development.local
```

Buka file `.env.development.local` menggunakan text editor (misalnya VS Code) dan sesuaikan konfigurasi environment:

```env
# URL Koneksi PostgreSQL (ganti dengan kredensial database Anda)
DATABASE_URL=postgres://username:password@localhost:5432/simatkul_db

# Port server API dijalankan
PORT=3000

# Mode environment
NODE_ENV=development

# Konfigurasi secret key dan masa aktif JWT
JWT_SECRET=rahasiasimatkulsuperaman123
JWT_EXPIRES_IN=1d
```

> [!NOTE]
> **Koneksi Database Cloud (Aiven / Supabase / Neon):**  
> Sistem konfigurasi database telah mendukung handshake SSL remote (`rejectUnauthorized: false`) secara otomatis.

### 5. Menjalankan Development Server

Jalankan server dalam mode pengembangan dengan dukungan *hot-reload* (Nodemon):

```bash
# Menggunakan PNPM
pnpm dev

# Atau menggunakan NPM
npm run dev

# Atau menggunakan Bun
bun dev
```

Jika server berhasil berjalan dan terhubung ke database, terminal akan menampilkan output:
```text
Database connected successfully
Listening To http://localhost:3000
```

### 6. Verifikasi API

Buka browser atau API client (Postman/Thunder Client/cURL) dan akses URL:
```text
http://localhost:3000/
```
Respons yang diharapkan:
```text
Hello World
```

---

## 📜 Skrip yang Tersedia

| Command | Fungsi |
| :--- | :--- |
| `pnpm dev` | Menjalankan development server dengan auto-reload (Nodemon) |
| `pnpm start` | Menjalankan server dalam mode produksi (`node server.js`) |
| `pnpm test` | Menjalankan unit/integration testing |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **[MIT License](LICENSE)**. Anda bebas menggunakan, memodifikasi, dan mendistribusikan proyek ini untuk keperluan pribadi maupun komersial.

## 🤝 Panduan Kolaborasi & Kontribusi

### Konvensi Pesan Commit
- Gunakan standar [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) untuk seluruh pesan commit.
- Awali pesan commit Anda dengan salah satu tipe berikut:
  - `feat`: Menambahkan fitur baru
  - `fix`: Memperbaiki bug
  - `docs`: Perubahan atau pembaruan dokumentasi saja
  - `chore`: Perubahan pemeliharaan, build, atau perkakas (*tooling*)
  - `refactor`: Perubahan struktur kode yang tidak memperbaiki bug maupun menambah fitur
  - `test`: Menambah atau memperbarui pengujian (*unit/integration test*)
  - `style`: Format kode, titik koma, spasi, dsb (tidak ada perubahan logika kode)
  - `perf`: Peningkatan performa atau optimasi kode
- Contoh:
  ```
  feat(auth): add OAuth login with Google
  fix(product): correct price calculation bug
  docs: update README with setup instructions
  ```

### Konvensi Penamaan Branch
- Gunakan format: `<devname>.<feature>`
- Contoh: `arrofi.auth`, `wafiy.product-listing`, `denis.fix-login`
- Gunakan nama fitur yang singkat dan deskriptif. Gunakan tanda hubung (*hyphen*) jika terdiri dari beberapa kata: `john.product-table-fix`

### Aturan Pull Request (PR)
- Judul PR harus jelas dan mereferensikan perubahan utama yang dibuat (contoh: `feat: add Kanban drag-and-drop`).
- Tautkan *issue* terkait pada deskripsi PR jika tersedia.
- Berikan ringkasan perubahan yang jelas serta instruksi khusus bagi *reviewer* jika diperlukan.
- Pastikan seluruh pengecekan (CI, *lint*, *test*) lolos sebelum meminta *review*.
- Tugaskan (*assign*) minimal satu *reviewer*; hindari melakukan *self-merge* kecuali dalam kondisi mendesak.
- Gunakan *Draft PR* untuk pekerjaan yang masih dalam tahap pengerjaan (*work-in-progress*).

### Aturan Umum Kolaborasi
- Lakukan sinkronisasi dengan branch `dev` terbaru sebelum memulai pekerjaan baru.
- Usahakan ukuran PR tetap terfokus dan sekecil mungkin; pisahkan menjadi beberapa PR jika perubahan terlalu besar.
- Tambahkan komentar kode (*code comments*) untuk logika yang kompleks atau keputusan arsitektur tertentu.
- Dokumentasikan variabel lingkungan (*environment variables*) baru atau perubahan konfigurasi pada file README.
- Diskusikan *breaking changes* atau perubahan arsitektur besar di *issue* sebelum mulai mengimplementasikannya.
- Selalu bersikap saling menghargai dan konstruktif dalam diskusi serta *code review*.

### Alur Kerja Push/Pull (Git Workflow)

Proyek ini menggunakan dua branch utama:
- **main**: Branch produksi / *production* (kode stabil siap rilis/deploy)
- **dev**: Branch pengembangan / *staging* (untuk integrasi fitur dan pengujian bersama)

> **Semua branch fitur/perbaikan wajib di-merge ke branch `dev`, _bukan_ langsung ke `main`. Hanya maintainer yang berhak melakukan merge dari `dev` ke `main` saat rilis produksi.**

#### Langkah-langkah Alur Kerja Kontributor
<picture><img alt="Sentry" src=".github/images/git_workflow.png">
        </picture>

1. **Sinkronkan repositori lokal Anda**
   - Pastikan Anda berada pada branch `dev` terbaru:
     ```sh
     git checkout dev
     git pull origin dev
     ```
2. **Buat branch fitur/perbaikan baru**
   - Gunakan konvensi penamaan branch yang telah ditentukan:
     ```sh
     git checkout -b <devname>.<feature>
     # Contoh: git checkout -b nafhan.auth
     ```
3. **Kerjakan perubahan kode Anda**
   - Lakukan commit dengan format [conventional commit](#konvensi-pesan-commit).
4. **Sinkronkan dengan `dev` sebelum melakukan push**
   - Sebelum push, selalu tarik perubahan terbaru dari `dev` untuk menghindari konflik (*merge conflict*):
     ```sh
     git checkout dev
     git pull origin dev
     git checkout <your-branch>
     git merge dev
     # Selesaikan konflik jika ada
     ```
5. **Push branch Anda ke remote repository**
   ```sh
   git push origin <your-branch>
   ```
6. **Buka Pull Request (PR)**
   - Arahkan target branch ke `dev` (bukan `main`).
   - Lengkapi deskripsi PR, tautkan *issue* jika ada, dan ajukan permintaan *review*.