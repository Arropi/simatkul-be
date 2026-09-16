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
