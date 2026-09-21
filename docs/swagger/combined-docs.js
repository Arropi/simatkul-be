import { authSwaggerDoc } from "./auth-docs.js";
import { masterDataSwaggerDoc } from "./master-data-docs.js";

export const combinedSwaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "SIMATKUL API - All Modules",
    version: "1.0.0",
    description: `### 🎓 SIMATKUL Backend RESTful API Documentation

Dokumentasi lengkap seluruh endpoint SIMATKUL API (Sistem Informasi Pengaturan Mata Kuliah) yang mencakup **Modul Auth** dan **Modul Master Data**.

---

### ⚠️ Format Error Response Global (error-middleware.js)

Seluruh endpoint pada API ini menggunakan mekanisme penanganan error terpusat melalui \`middleware/error-middleware.js\`. Setiap terjadi error (baik validasi Zod, autentikasi, otorisasi, data tidak ditemukan, atau server error), server **selalu** mengembalikan struktur JSON konsisten berikut:

\`\`\`json
{
  "message": "Deskripsi pesan kesalahan spesifik"
}
\`\`\`

#### Daftar Status Code & Skenario:
- **\`400 Bad Request\`**: Input tidak valid (gagal validasi Zod, ID bukan integer positif, prodi tidak terdaftar, duplikasi data unik).
- **\`401 Unauthorized\`**: Kredensial login salah, token JWT tidak ada atau tidak valid.
- **\`403 Forbidden\`**: Pengguna tidak memiliki hak akses (role bukan admin).
- **\`404 Not Found\`**: Data kurikulum / mata kuliah / dosen / kelas / ruang / sesi tidak ditemukan di database.
- **\`500 Internal Server Error\`**: Kesalahan tak terduga pada server atau koneksi database.
`,
    contact: {
      name: "SIMATKUL Development Team",
    },
  },
  servers: [
    {
      url: "/",
      description: "Current Server",
    },
  ],
  tags: [
    ...authSwaggerDoc.tags,
    ...masterDataSwaggerDoc.tags,
  ],
  paths: {
    ...authSwaggerDoc.paths,
    ...masterDataSwaggerDoc.paths,
  },
  components: {
    securitySchemes: {
      ...authSwaggerDoc.components.securitySchemes,
      ...masterDataSwaggerDoc.components.securitySchemes,
    },
    schemas: {
      ...authSwaggerDoc.components.schemas,
      ...masterDataSwaggerDoc.components.schemas,
      GlobalErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Pesan error terstandarisasi yang dihasilkan oleh error-middleware.js",
            example: "Parameter kurikulum_id harus berupa angka integer positif",
          },
        },
      },
    },
  },
};
