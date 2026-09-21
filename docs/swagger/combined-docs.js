import { authSwaggerDoc } from "./auth-docs.js";
import { masterDataSwaggerDoc } from "./master-data-docs.js";
import { globalErrorSchemas, globalErrorResponses } from "./error-schema.js";

export const combinedSwaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "SIMATKUL API - Documentation",
    version: "1.0.0",
    description: `### SIMATKUL Backend RESTful API Documentation

Dokumentasi lengkap seluruh endpoint SIMATKUL API (Sistem Informasi Pengaturan Mata Kuliah) yang mencakup **Modul Auth** dan **Modul Master Data**.

---

### Penanganan Error Terpusat (Global Error Handling)

Seluruh endpoint pada API ini menggunakan mekanisme penanganan error terpusat melalui \`middleware/error-middleware.js\`. Setiap terjadi kegagalan request, server **selalu** mengembalikan struktur JSON konsisten berikut:

\`\`\`json
{
  "message": "Deskripsi pesan kesalahan spesifik"
}
\`\`\`

Silakan periksa definisi skema **\`GlobalErrorResponse\`** di bagian bawah (**Schemas**) untuk melihat spesifikasi detail struktur response error.

#### Ringkasan Status Code HTTP:
- **\`400 Bad Request\`**: Input tidak valid (gagal validasi Zod, ID bukan integer positif, duplikasi data, dsb.).
- **\`401 Unauthorized\`**: Kredensial login salah, atau token JWT tidak ada / tidak valid.
- **\`403 Forbidden\`**: Pengguna tidak memiliki hak akses (role bukan admin).
- **\`404 Not Found\`**: Data kurikulum, mata kuliah, dosen, kelas, ruang, atau sesi tidak ditemukan.
- **\`500 Internal Server Error\`**: Kesalahan tak terduga pada server atau database.
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
      ...globalErrorSchemas,
      ErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            description: "Pesan deskripsi kesalahan terstandarisasi dari error-middleware.js",
            example: "Penjelasan pesan error validasi atau sistem",
          },
        },
      },
    },
    responses: {
      ...globalErrorResponses,
    },
  },
};
