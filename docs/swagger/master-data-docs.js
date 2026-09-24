export const masterDataSwaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "SIMATKUL API - Master Data Module",
    version: "1.0.0",
    description: `Dokumentasi API SIMATKUL untuk **Modul Master Data** yang mencakup manajemen Kurikulum, Mata Kuliah (dengan fitur filter, search, & pagination), Dosen, Kelas, Ruang, dan Sesi perkuliahan.

---

### Format Penjelasan Error Response Global (\`middleware/error-middleware.js\`)
Seluruh error pada API Master Data dikembalikan dalam struktur JSON standar yang seragam:
\`\`\`json
{
  "message": "Deskripsi pesan kesalahan"
}
\`\`\`
- **\`400 Bad Request\`**: Validasi input Zod gagal (misal: \`"Field nama tidak boleh kosong"\`), parameter ID bukan integer positif (\`"Parameter ID harus berupa angka integer positif"\`), atau pelanggaran aturan kurikulum ganjil/genap.
- **\`404 Not Found\`**: Data kurikulum / mata kuliah / dosen / kelas / ruang / sesi tidak ditemukan di database (\`"Data mata kuliah dengan ID 999 tidak ditemukan"\`).
- **\`500 Internal Server Error\`**: Kesalahan tak terduga pada server (\`"Internal Server Error"\`).
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
    {
      name: "Kurikulum",
      description: "Operasi CRUD data kurikulum beserta fitur penyalinan (copy) relasi antar-kurikulum",
    },
    {
      name: "Mata Kuliah",
      description: "Operasi CRUD mata kuliah dilengkapi fitur filter, pencarian (search), pengurutan (sort), dan paginasi (pagination)",
    },
    {
      name: "Dosen",
      description: "Operasi CRUD data pengajar / dosen dan relasinya dengan kurikulum",
    },
    {
      name: "Kelas",
      description: "Operasi CRUD rombel / kelas perkuliahan (teori maupun praktikum)",
    },
    {
      name: "Ruang",
      description: "Operasi CRUD ruangan perkuliahan dan laboratorium",
    },
    {
      name: "Sesi",
      description: "Operasi CRUD jam/sesi perkuliahan (jam mulai dan jam selesai)",
    },
  ],
  paths: {
    // ================= KURIKULUM =================
    "/api/master-data/kurikulum": {
      get: {
        tags: ["Kurikulum"],
        summary: "Ambil semua data kurikulum",
        description: "Mengambil seluruh daftar kurikulum beserta agregasi total relasi (mata kuliah, sesi, dosen, kelas, ruang).",
        responses: {
          200: {
            description: "Daftar kurikulum berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kurikulum berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Kurikulum" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Kurikulum"],
        summary: "Tambah data kurikulum baru",
        description: "Menambahkan kurikulum baru. Jika opsi `copy=true` dan `kurikulumId` disertakan, relasi (mata kuliah, dosen, kelas, ruang, sesi) dari kurikulum asal akan diduplikasi secara otomatis.",
        parameters: [
          {
            name: "copy",
            in: "query",
            required: false,
            schema: { type: "boolean" },
            description: "Set `true` untuk menyalin relasi dari kurikulum asal",
            example: false,
          },
          {
            name: "kurikulumId",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "ID kurikulum sumber untuk disalin relasinya",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateKurikulumRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Kurikulum berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kurikulum berhasil ditambahkan" },
                    data: { $ref: "#/components/schemas/Kurikulum" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum asal untuk copy tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/master-data/kurikulum/{id}": {
      get: {
        tags: ["Kurikulum"],
        summary: "Ambil detail kurikulum berdasarkan ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data kurikulum berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kurikulum berhasil diambil" },
                    data: { $ref: "#/components/schemas/Kurikulum" },
                  },
                },
              },
            },
          },
          400: {
            description: "Parameter ID tidak valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Kurikulum"],
        summary: "Perbarui data kurikulum",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateKurikulumRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Kurikulum berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kurikulum berhasil diperbarui" },
                    data: { $ref: "#/components/schemas/Kurikulum" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Kurikulum"],
        summary: "Hapus data kurikulum",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Kurikulum berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kurikulum berhasil dihapus" },
                    data: { $ref: "#/components/schemas/Kurikulum" },
                  },
                },
              },
            },
          },
          404: {
            description: "Kurikulum tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ================= MATA KULIAH =================
    "/api/master-data/mata-kuliah": {
      get: {
        tags: ["Mata Kuliah"],
        summary: "Ambil semua data mata kuliah",
        description: "Mengambil semua mata kuliah. Bisa difilter berdasarkan kurikulum_id.",
        parameters: [
          {
            name: "kurikulum_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter opsional ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data mata kuliah berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data mata kuliah berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/MataKuliah" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/mata-kuliah/kurikulum/{kurikulumId}": {
      get: {
        tags: ["Mata Kuliah"],
        summary: "Ambil mata kuliah berdasarkan Kurikulum ID (Filter, Search, & Pagination)",
        description:
          "Endpoint utama untuk mengambil mata kuliah pada suatu kurikulum dengan query parameter lengkap untuk pencarian nama/kode, filter (prodi, semester ganjil/genap/angka, jenis, kelompok, tipe kelas, sks), pengurutan, dan paginasi.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Nomor halaman pagination",
            example: 1,
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "string", default: "10" },
            description: "Jumlah data per halaman (angka) atau 'all' untuk menampilkan semua tanpa limit",
            example: 10,
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Kata kunci pencarian pada nama mata kuliah atau kode mata kuliah (case-insensitive)",
            example: "algoritma",
          },
          {
            name: "q",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Alias kata kunci pencarian (sama fungsinya dengan parameter `search`)",
          },
          {
            name: "prodi",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["TRPL", "TRI", "TRE", "TRIK"] },
            description: "Filter program studi (case-insensitive)",
            example: "TRPL",
          },
          {
            name: "semester",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Filter semester: angka semester spesifik (1, 2, 3...) atau tipe 'ganjil' / 'genap'",
            example: "1",
          },
          {
            name: "jenis",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["Wajib", "Pilihan"] },
            description: "Filter jenis mata kuliah: 'Wajib' atau 'Pilihan'",
            example: "Wajib",
          },
          {
            name: "kelompok",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["Teori", "Praktikum"] },
            description: "Filter kelompok: 'Teori' atau 'Praktikum'",
            example: "Teori",
          },
          {
            name: "tipe_kelas",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["MKK", "MKDU"] },
            description: "Filter tipe kelas: 'MKK' atau 'MKDU'",
            example: "MKK",
          },
          {
            name: "sks",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 10 },
            description: "Filter jumlah SKS (1 - 10)",
            example: 3,
          },
          {
            name: "kode",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter kode mata kuliah spesifik",
            example: 101,
          },
          {
            name: "sortBy",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["id", "kode", "nama", "sks", "prodi", "jenis", "kelompok", "tipe_kelas", "semester"],
              default: "id",
            },
            description: "Kolom pengurutan data",
            example: "semester",
          },
          {
            name: "order",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
            description: "Arah pengurutan: 'asc' atau 'desc'",
            example: "asc",
          },
          {
            name: "paginate",
            in: "query",
            required: false,
            schema: { type: "boolean", default: true },
            description: "Set `false` jika ingin mengambil seluruh data tanpa paginasi",
            example: true,
          },
        ],
        responses: {
          200: {
            description: "Data mata kuliah berhasil diambil beserta metadata pagination",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MataKuliahPaginatedResponse" },
              },
            },
          },
          400: {
            description: "Validasi parameter / query string gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum dengan ID tersebut tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/master-data/mata-kuliah/{id}": {
      get: {
        tags: ["Mata Kuliah"],
        summary: "Ambil detail mata kuliah berdasarkan ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID mata kuliah",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data mata kuliah berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data mata kuliah berhasil diambil" },
                    data: { $ref: "#/components/schemas/MataKuliah" },
                  },
                },
              },
            },
          },
          404: {
            description: "Mata kuliah tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Mata Kuliah"],
        summary: "Perbarui data mata kuliah",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID mata kuliah",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateMataKuliahRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Data mata kuliah berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data mata kuliah berhasil diperbarui" },
                    data: { $ref: "#/components/schemas/MataKuliah" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Mata kuliah tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Mata Kuliah"],
        summary: "Hapus data mata kuliah",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID mata kuliah",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Mata kuliah berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data mata kuliah berhasil dihapus" },
                    data: { $ref: "#/components/schemas/MataKuliah" },
                  },
                },
              },
            },
          },
          404: {
            description: "Mata kuliah tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/master-data/mata-kuliah/{kurikulumId}": {
      post: {
        tags: ["Mata Kuliah"],
        summary: "Tambah data mata kuliah baru dan hubungkan ke kurikulum",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum penampung mata kuliah",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateMataKuliahRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Mata kuliah berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data mata kuliah berhasil ditambahkan" },
                    data: { $ref: "#/components/schemas/MataKuliah" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal / semester tidak cocok dengan kurikulum",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ================= DOSEN =================
    "/api/master-data/dosen": {
      get: {
        tags: ["Dosen"],
        summary: "Ambil semua data dosen",
        parameters: [
          {
            name: "kurikulum_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter dosen berdasarkan kurikulum_id",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data dosen berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data dosen berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Dosen" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/dosen/kurikulum/{kurikulumId}": {
      get: {
        tags: ["Dosen"],
        summary: "Ambil data dosen berdasarkan Kurikulum ID",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data dosen berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data dosen berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Dosen" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/dosen/{id}": {
      get: {
        tags: ["Dosen"],
        summary: "Ambil detail dosen berdasarkan ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID dosen",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data dosen berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data dosen berhasil diambil" },
                    data: { $ref: "#/components/schemas/Dosen" },
                  },
                },
              },
            },
          },
          404: {
            description: "Dosen tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Dosen"],
        summary: "Perbarui data dosen",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID dosen",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateDosenRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Data dosen berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data dosen berhasil diperbarui" },
                    data: { $ref: "#/components/schemas/Dosen" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Dosen tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Dosen"],
        summary: "Hapus data dosen",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID dosen",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Dosen berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data dosen berhasil dihapus" },
                    data: { $ref: "#/components/schemas/Dosen" },
                  },
                },
              },
            },
          },
          404: {
            description: "Dosen tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/master-data/dosen/{kurikulumId}": {
      post: {
        tags: ["Dosen"],
        summary: "Tambah data dosen baru dan hubungkan ke kurikulum",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateDosenRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Dosen berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data dosen berhasil ditambahkan" },
                    data: { $ref: "#/components/schemas/Dosen" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ================= KELAS =================
    "/api/master-data/kelas": {
      get: {
        tags: ["Kelas"],
        summary: "Ambil semua data kelas",
        parameters: [
          {
            name: "kurikulum_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter berdasarkan ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data kelas berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kelas berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Kelas" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/kelas/kurikulum/{kurikulumId}": {
      get: {
        tags: ["Kelas"],
        summary: "Ambil data kelas berdasarkan Kurikulum ID",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data kelas berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kelas berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Kelas" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/kelas/{id}": {
      get: {
        tags: ["Kelas"],
        summary: "Ambil detail kelas berdasarkan ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kelas",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data kelas berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kelas berhasil diambil" },
                    data: { $ref: "#/components/schemas/Kelas" },
                  },
                },
              },
            },
          },
          404: {
            description: "Kelas tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/master-data/kelas/{kurikulumId}": {
      post: {
        tags: ["Kelas"],
        summary: "Tambah data kelas (generate otomatis teori & praktikum)",
        description:
          "Membuat rombel kelas teori dan praktikum secara otomatis berdasarkan prodi, semester, `kelas_teori`, dan `kelas_praktikum`.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateKelasRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Kelas berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kelas berhasil ditambahkan" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Kelas" },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Kelas"],
        summary: "Perbarui data kelas berdasarkan semester dan kurikulum ID",
        description:
          "Menghapus seluruh kelas pada semester dan kurikulum ID tersebut, kemudian membuat ulang sesuai konfigurasi baru.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateKelasRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Data kelas berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kelas berhasil diperbarui" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Kelas" },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum atau data kelas tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Kelas"],
        summary: "Hapus data kelas berdasarkan semester dan kurikulum ID",
        description:
          "Menghapus seluruh kelas yang terkait dengan semester dan kurikulum ID yang ditentukan.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
          {
            name: "semester",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Semester kelas yang akan dihapus (dapat dikirim via query atau body)",
            example: 1,
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  semester: { type: "integer", example: 1, description: "Semester kelas yang akan dihapus" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Kelas berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data kelas berhasil dihapus" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Kelas" },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Parameter semester tidak valid atau tidak disediakan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kelas tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ================= RUANG =================
    "/api/master-data/ruang": {
      get: {
        tags: ["Ruang"],
        summary: "Ambil semua data ruang",
        parameters: [
          {
            name: "kurikulum_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter berdasarkan ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data ruang berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data ruang berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Ruang" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/ruang/kurikulum/{kurikulumId}": {
      get: {
        tags: ["Ruang"],
        summary: "Ambil data ruang berdasarkan Kurikulum ID",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data ruang berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data ruang berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Ruang" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/ruang/{id}": {
      get: {
        tags: ["Ruang"],
        summary: "Ambil detail ruang berdasarkan ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID ruang",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data ruang berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data ruang berhasil diambil" },
                    data: { $ref: "#/components/schemas/Ruang" },
                  },
                },
              },
            },
          },
          404: {
            description: "Ruang tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Ruang"],
        summary: "Perbarui data ruang",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID ruang",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateRuangRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Data ruang berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data ruang berhasil diperbarui" },
                    data: { $ref: "#/components/schemas/Ruang" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Ruang tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Ruang"],
        summary: "Hapus data ruang",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID ruang",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Ruang berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data ruang berhasil dihapus" },
                    data: { $ref: "#/components/schemas/Ruang" },
                  },
                },
              },
            },
          },
          404: {
            description: "Ruang tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/master-data/ruang/{kurikulumId}": {
      post: {
        tags: ["Ruang"],
        summary: "Tambah data ruang baru dan hubungkan ke kurikulum",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateRuangRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Ruang berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data ruang berhasil ditambahkan" },
                    data: { $ref: "#/components/schemas/Ruang" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ================= SESI =================
    "/api/master-data/sesi": {
      get: {
        tags: ["Sesi"],
        summary: "Ambil semua data sesi",
        parameters: [
          {
            name: "kurikulum_id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter berdasarkan ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data sesi berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data sesi berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Sesi" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/sesi/kurikulum/{kurikulumId}": {
      get: {
        tags: ["Sesi"],
        summary: "Ambil data sesi berdasarkan Kurikulum ID",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data sesi berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data sesi berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Sesi" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/master-data/sesi/{id}": {
      get: {
        tags: ["Sesi"],
        summary: "Ambil detail sesi berdasarkan ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID sesi",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Data sesi berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data sesi berhasil diambil" },
                    data: { $ref: "#/components/schemas/Sesi" },
                  },
                },
              },
            },
          },
          404: {
            description: "Sesi tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Sesi"],
        summary: "Perbarui data sesi",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID sesi",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateSesiRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Data sesi berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data sesi berhasil diperbarui" },
                    data: { $ref: "#/components/schemas/Sesi" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal: jam_mulai tidak boleh lebih lambat dari jam_akhir",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Sesi tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Sesi"],
        summary: "Hapus data sesi",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID sesi",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Sesi berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data sesi berhasil dihapus" },
                    data: { $ref: "#/components/schemas/Sesi" },
                  },
                },
              },
            },
          },
          404: {
            description: "Sesi tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/master-data/sesi/{kurikulumId}": {
      post: {
        tags: ["Sesi"],
        summary: "Tambah data sesi baru dan hubungkan ke kurikulum",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID kurikulum",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateSesiRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Sesi berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data sesi berhasil ditambahkan" },
                    data: { $ref: "#/components/schemas/Sesi" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal: format waktu tidak valid atau jam_mulai lebih lambat dari jam_akhir",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Kurikulum tidak ditemukan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Masukkan JWT token dengan format: Bearer <token>",
      },
    },
    schemas: {
      // Kurikulum
      Kurikulum: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nama: { type: "string", example: "Ganjil 2026/2027" },
          semester: { type: "string", enum: ["Ganjil", "Genap"], example: "Ganjil" },
          tahun: { type: "string", format: "date", example: "2026-01-01" },
          description: { type: "string", nullable: true, example: "Kurikulum Program Studi Tahun Ajaran 2026/2027" },
          total_mata_kuliah: { type: "integer", example: 12 },
          total_sesi: { type: "integer", example: 8 },
          total_dosen: { type: "integer", example: 15 },
          total_kelas: { type: "integer", example: 6 },
          total_ruang: { type: "integer", example: 4 },
        },
      },
      CreateKurikulumRequest: {
        type: "object",
        required: ["semester", "tahun_ajaran"],
        properties: {
          semester: { type: "string", enum: ["Ganjil", "Genap"], example: "Ganjil" },
          tahun_ajaran: { type: "integer", minimum: 1900, maximum: 2100, example: 2026 },
          description: { type: "string", nullable: true, example: "Kurikulum Semester Ganjil 2026" },
          copy: { type: "boolean", default: false, example: false },
          kurikulumId: { type: "integer", description: "ID kurikulum sumber yang ingin disalin relasinya", example: 1 },
        },
      },
      UpdateKurikulumRequest: {
        type: "object",
        properties: {
          semester: { type: "string", enum: ["Ganjil", "Genap"], example: "Ganjil" },
          tahun_ajaran: { type: "integer", minimum: 1900, maximum: 2100, example: 2026 },
          description: { type: "string", nullable: true, example: "Deskripsi kurikulum yang diperbarui" },
        },
      },

      // Mata Kuliah
      MataKuliah: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          kode: { type: "integer", example: 101 },
          nama: { type: "string", example: "Algoritma dan Struktur Data" },
          sks: { type: "integer", example: 3 },
          prodi: { type: "string", enum: ["TRPL", "TRI", "TRE", "TRIK"], example: "TRPL" },
          jenis: { type: "string", enum: ["Wajib", "Pilihan"], example: "Wajib" },
          kelompok: { type: "string", enum: ["Teori", "Praktikum"], example: "Teori" },
          tipe_kelas: { type: "string", enum: ["MKK", "MKDU"], example: "MKK" },
          semester: { type: "integer", example: 1 },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 25 },
          totalPages: { type: "integer", example: 3 },
          hasNextPage: { type: "boolean", example: true },
          hasPrevPage: { type: "boolean", example: false },
        },
      },
      MataKuliahPaginatedResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Data mata kuliah berhasil diambil" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/MataKuliah" },
          },
          pagination: { $ref: "#/components/schemas/PaginationMeta" },
        },
      },
      CreateMataKuliahRequest: {
        type: "object",
        required: ["kode", "nama", "sks", "prodi", "jenis", "kelompok", "tipe_kelas", "semester"],
        properties: {
          kode: { type: "integer", minimum: 1, example: 101 },
          nama: { type: "string", example: "Basis Data" },
          sks: { type: "integer", minimum: 1, maximum: 10, example: 3 },
          prodi: { type: "string", enum: ["TRPL", "TRI", "TRE", "TRIK"], example: "TRPL" },
          jenis: { type: "string", enum: ["Wajib", "Pilihan"], example: "Wajib" },
          kelompok: { type: "string", enum: ["Teori", "Praktikum"], example: "Teori" },
          tipe_kelas: { type: "string", enum: ["MKK", "MKDU"], example: "MKK" },
          semester: { type: "integer", minimum: 1, example: 1 },
        },
      },
      UpdateMataKuliahRequest: {
        type: "object",
        properties: {
          kode: { type: "integer", minimum: 1, example: 101 },
          nama: { type: "string", example: "Basis Data Lanjut" },
          sks: { type: "integer", minimum: 1, maximum: 10, example: 3 },
          prodi: { type: "string", enum: ["TRPL", "TRI", "TRE", "TRIK"], example: "TRPL" },
          jenis: { type: "string", enum: ["Wajib", "Pilihan"], example: "Wajib" },
          kelompok: { type: "string", enum: ["Teori", "Praktikum"], example: "Teori" },
          tipe_kelas: { type: "string", enum: ["MKK", "MKDU"], example: "MKK" },
          semester: { type: "integer", minimum: 1, example: 1 },
        },
      },

      // Dosen
      Dosen: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nama: { type: "string", example: "Dr. Budi Santoso, M.Kom." },
          nidn: { type: "string", example: "0012058401" },
          jabatan_akademik: { type: "string", example: "Lektor" },
        },
      },
      CreateDosenRequest: {
        type: "object",
        required: ["nama", "nidn", "jabatan_akademik"],
        properties: {
          nama: { type: "string", example: "Dr. Budi Santoso, M.Kom." },
          nidn: { type: "string", example: "0012058401" },
          jabatan_akademik: { type: "string", example: "Lektor" },
        },
      },
      UpdateDosenRequest: {
        type: "object",
        properties: {
          nama: { type: "string", example: "Dr. Budi Santoso, M.Kom." },
          nidn: { type: "string", example: "0012058401" },
          jabatan_akademik: { type: "string", example: "Lektor Kepala" },
        },
      },

      // Kelas
      Kelas: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          prodi: { type: "string", enum: ["TRI", "TRPL", "TRIK", "TRE"], example: "TRPL" },
          semester: { type: "integer", example: 1 },
          kelas: { type: "string", example: "A" },
          kode_kelas: { type: "string", example: "TRPL-1A" },
        },
      },
      CreateKelasRequest: {
        type: "object",
        required: ["prodi", "semester", "kelas_teori", "kelas_praktikum"],
        properties: {
          prodi: { type: "string", enum: ["TRI", "TRPL", "TRIK", "TRE"], example: "TRPL" },
          semester: { type: "integer", minimum: 1, example: 4 },
          kelas_teori: { type: "integer", minimum: 1, example: 2, description: "Jumlah kelas rombel teori (misal: 2 = AA & BB)" },
          kelas_praktikum: { type: "integer", minimum: 1, example: 4, description: "Jumlah rombel praktikum (misal: 4 = A1, A2, B1, B2)" },
        },
      },
      UpdateKelasRequest: {
        type: "object",
        required: ["semester", "kelas_teori", "kelas_praktikum"],
        properties: {
          prodi: { type: "string", enum: ["TRI", "TRPL", "TRIK", "TRE"], example: "TRPL", description: "Opsional jika sudah ada data kelas sebelumnya" },
          semester: { type: "integer", minimum: 1, example: 4 },
          kelas_teori: { type: "integer", minimum: 1, example: 2, description: "Jumlah kelas rombel teori (misal: 2 = AA & BB)" },
          kelas_praktikum: { type: "integer", minimum: 1, example: 4, description: "Jumlah rombel praktikum (misal: 4 = A1, A2, B1, B2)" },
        },
      },

      // Ruang
      Ruang: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nama: { type: "string", example: "Lab Komputer 1" },
        },
      },
      CreateRuangRequest: {
        type: "object",
        required: ["nama"],
        properties: {
          nama: { type: "string", example: "Lab Komputer 1" },
        },
      },
      UpdateRuangRequest: {
        type: "object",
        properties: {
          nama: { type: "string", example: "Ruang Kuliah 203" },
        },
      },

      // Sesi
      Sesi: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nama: { type: "integer", example: 1, description: "Nomor urut sesi" },
          jam_mulai: { type: "string", format: "time", example: "07:30:00" },
          jam_akhir: { type: "string", format: "time", example: "09:10:00" },
        },
      },
      CreateSesiRequest: {
        type: "object",
        required: ["nama", "jam_mulai", "jam_akhir"],
        properties: {
          nama: { type: "integer", minimum: 1, example: 1 },
          jam_mulai: { type: "string", example: "07:30:00", description: "Format: HH:mm atau HH:mm:ss" },
          jam_akhir: { type: "string", example: "09:10:00", description: "Harus lebih lambat daripada jam_mulai" },
        },
      },
      UpdateSesiRequest: {
        type: "object",
        properties: {
          nama: { type: "integer", minimum: 1, example: 1 },
          jam_mulai: { type: "string", example: "07:30:00" },
          jam_akhir: { type: "string", example: "09:10:00" },
        },
      },

      // Error Response
      ErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Penjelasan pesan error validasi atau sistem" },
        },
      },
      GlobalErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            description: "Format response error global terstandarisasi dari error-middleware.js",
            example: "Parameter ID harus berupa angka integer positif",
          },
        },
      },
    },
  },
};
