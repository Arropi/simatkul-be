import { globalErrorSchemas, globalErrorResponses } from "./error-schema.js";

export const penjadwalanSwaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "SIMATKUL API - Penjadwalan Module",
    version: "1.0.0",
    description: `Dokumentasi API SIMATKUL untuk **Modul Penjadwalan**.
Mendukung otomasi dan validasi jadwal perkuliahan, form options dinamis, pemantauan okupansi ruang, beban SKS pengajar, jadwal kelas, serta dukungan fleksibel untuk **multi-sesi** (\`penjadwalan_sesi\`) dan **multi-dosen** / tim pengajar (\`penjadwalan_dosen\`).

---

### Fitur & Aturan Logika Penjadwalan:
1. **Multi-Sesi & Multi-Dosen**: Satu jadwal kelas pada mata kuliah dan hari tertentu dapat memiliki banyak sesi (\`sesi_ids: [1, 2]\`) dan banyak dosen pengajar (\`dosen_ids: [3, 4]\`).
2. **Pengecekan Bentrok (Collision Detection)**:
   - **Bentrok Ruang**: Ruang yang sama tidak dapat digunakan pada sesi dan hari yang sama.
   - **Bentrok Kelas**: Kelas yang sama tidak dapat memiliki jadwal lain pada sesi dan hari yang sama.
   - **Bentrok Dosen**: Seluruh dosen pengajar diperiksa; tidak boleh ada dosen yang memiliki jadwal mengajar lain pada sesi dan hari tersebut.
   - **Bentrok Kelas Kompleks (Teori vs Praktikum)**:
     - Grup A: Kelas teori \`AA\` bentrok dengan kelas praktikum \`A1\` dan \`A2\` (namun \`A1\` dan \`A2\` dapat berjalan bersamaan di ruangan berbeda).
     - Grup B: Kelas teori \`BB\` bentrok dengan kelas praktikum \`B1\` dan \`B2\` (namun \`B1\` dan \`B2\` dapat berjalan bersamaan di ruangan berbeda).
     - Kelas gabungan \`AB\` bentrok dengan seluruh kelas dalam prodi & semester yang sama.
3. **Pengecualian ID pada Update (PUT)**: Record yang sedang diedit dikecualikan dari deteksi bentrok agar tidak menimbulkan bentrok terhadap dirinya sendiri.
4. **Formula Okupansi Ruang**:
   $$\\text{Okupansi} = \\left(\\frac{\\text{Banyaknya slot sesi ruang digunakan}}{\\text{Total sesi kurikulum} \\times 5}\\right) \\times 100\\%$$
5. **Beban SKS Dosen**: Akumulasi SKS mata kuliah per kelas yang diajar oleh dosen bersangkutan.
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
      name: "Penjadwalan",
      description: "Operasi CRUD penjadwalan kuliah, opsi form, serta monitoring ruang, kelas, dan dosen",
    },
  ],
  paths: {
    "/api/penjadwalan/form-options/{kurikulumId}": {
      get: {
        tags: ["Penjadwalan"],
        summary: "Mengambil opsi form penjadwalan berdasarkan kurikulum",
        description: "Mengambil data ruang (id, nama), dosen (id, nama), sesi terurut (id, nama format 'Sesi X'), kelas (id, kode_kelas, prodi, semester), dan mata kuliah (id, nama, prodi) yang terdaftar pada kurikulum.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            description: "ID Kurikulum (integer positif)",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Data form options berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data form options penjadwalan berhasil diambil" },
                    data: { $ref: "#/components/schemas/FormOptionsData" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },

    "/api/penjadwalan/ruang/{kurikulumId}": {
      get: {
        tags: ["Penjadwalan"],
        summary: "Mengambil data penjadwalan seluruh ruang beserta persentase okupansi",
        description: "Mengembalikan daftar semua ruang di kurikulum dengan persentase okupansi dan daftar jadwal terkelompokkan per hari dan sesi terurut.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            description: "ID Kurikulum (integer positif)",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Data penjadwalan ruang berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data penjadwalan ruang berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PenjadwalanRuangItem" },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },

    "/api/penjadwalan/kelas/{kurikulumId}": {
      get: {
        tags: ["Penjadwalan"],
        summary: "Mengambil data penjadwalan seluruh kelas",
        description: "Mengembalikan daftar semua kelas pada kurikulum (key nama diambil dari kode_kelas) beserta jadwal perkuliahan per hari (termasuk nama_matkul, nama_ruang, dan nama_dosen).",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            description: "ID Kurikulum (integer positif)",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Data penjadwalan kelas berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data penjadwalan kelas berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PenjadwalanKelasItem" },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },

    "/api/penjadwalan/dosen/{kurikulumId}": {
      get: {
        tags: ["Penjadwalan"],
        summary: "Mengambil data penjadwalan seluruh dosen beserta beban SKS",
        description: "Mengembalikan daftar semua dosen pengajar beserta total beban SKS yang diakumulasikan dari mata kuliah per kelas yang diajarkan, serta jadwal sesi mengajar per hari.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            description: "ID Kurikulum (integer positif)",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Data penjadwalan dosen berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data penjadwalan dosen berhasil diambil" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PenjadwalanDosenItem" },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },

    "/api/penjadwalan/export-excel/dosen/{kurikulumId}": {
      get: {
        tags: ["Penjadwalan"],
        summary: "Export Excel Jadwal Dosen",
        description: "Mengekspor jadwal mengajar seluruh dosen dalam format spreadsheet .xlsx dengan tata letak matriks Sesi x Hari, kartu jadwal berurutan (multi-sesi), dan akumulasi beban SKS.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            description: "ID Kurikulum (integer positif)",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "File Excel Jadwal Dosen berhasil digenerate",
            content: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },

    "/api/penjadwalan/export-excel/kelas/{kurikulumId}": {
      get: {
        tags: ["Penjadwalan"],
        summary: "Export Excel Jadwal Kelas",
        description: "Mengekspor jadwal perkuliahan seluruh kelas dalam format spreadsheet .xlsx dengan tata letak matriks Sesi x Hari dan kartu jadwal berurutan (multi-sesi).",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            description: "ID Kurikulum (integer positif)",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "File Excel Jadwal Kelas berhasil digenerate",
            content: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },

    "/api/penjadwalan/export-excel/ruang/{kurikulumId}": {
      get: {
        tags: ["Penjadwalan"],
        summary: "Export Excel Jadwal Ruang",
        description: "Mengekspor jadwal penggunaan seluruh ruangan dalam format spreadsheet .xlsx dengan tata letak matriks Sesi x Hari, kartu jadwal berurutan (multi-sesi), dan persentase okupansi ruang.",
        parameters: [
          {
            name: "kurikulumId",
            in: "path",
            required: true,
            description: "ID Kurikulum (integer positif)",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "File Excel Jadwal Ruang berhasil digenerate",
            content: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },

    "/api/penjadwalan": {
      post: {
        tags: ["Penjadwalan"],
        summary: "Membuat data penjadwalan baru",
        description: "Menambahkan jadwal perkuliahan baru dengan validasi ketat terhadap bentrok ruang, kelas, dosen, dan kohort kelas kompleks. Mendukung multi-sesi (`sesi_ids: [1, 2]`) dan multi-dosen (`dosen_ids: [3, 4]`).",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PenjadwalanCreatePayload" },
            },
          },
        },
        responses: {
          201: {
            description: "Data penjadwalan berhasil ditambahkan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data penjadwalan berhasil ditambahkan" },
                    data: { $ref: "#/components/schemas/PenjadwalanDetail" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },

    "/api/penjadwalan/{penjadwalan_id}": {
      put: {
        tags: ["Penjadwalan"],
        summary: "Memperbarui data penjadwalan",
        description: "Memperbarui jadwal perkuliahan. Melakukan validasi bentrok dengan mengecualikan ID penjadwalan yang sedang diperbarui.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "penjadwalan_id",
            in: "path",
            required: true,
            description: "ID Penjadwalan (integer positif)",
            schema: { type: "integer", example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PenjadwalanUpdatePayload" },
            },
          },
        },
        responses: {
          200: {
            description: "Data penjadwalan berhasil diupdate",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data penjadwalan berhasil diupdate" },
                    data: { $ref: "#/components/schemas/PenjadwalanDetail" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
      delete: {
        tags: ["Penjadwalan"],
        summary: "Menghapus data penjadwalan",
        description: "Menghapus record penjadwalan beserta seluruh relasi sesinya di `penjadwalan_sesi` dan relasi dosen di `penjadwalan_dosen`.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "penjadwalan_id",
            in: "path",
            required: true,
            description: "ID Penjadwalan yang akan dihapus",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Data penjadwalan berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Data penjadwalan berhasil dihapus" },
                    data: { $ref: "#/components/schemas/PenjadwalanDetail" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Masukkan token JWT yang didapatkan dari endpoint `/api/auth/login`",
      },
    },
    schemas: {
      ...globalErrorSchemas,
      FormOptionsData: {
        type: "object",
        properties: {
          ruang: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                nama: { type: "string", example: "CU205" },
              },
            },
          },
          dosen: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                nama: { type: "string", example: "Dr. Budi Santoso, M.Kom." },
              },
            },
          },
          sesi: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                nama: { type: "string", example: "Sesi 1" },
              },
            },
          },
          kelas: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                kode_kelas: { type: "string", example: "PL4AA" },
                prodi: { type: "string", example: "TRPL" },
                semester: { type: "integer", example: 4 },
                kelas: { type: "string", example: "A" },
              },
            },
          },
          mata_kuliah: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                nama: { type: "string", example: "Pemrograman Web Lanjut" },
                prodi: { type: "string", example: "TRPL" },
              },
            },
          },
        },
      },

      JadwalKelasItem: {
        type: "object",
        properties: {
          hari: { type: "string", example: "senin" },
          sesi: {
            type: "array",
            items: { type: "integer" },
            example: [1, 2],
            description: "Nomor urutan sesi terurut (1, 2, 3, ...) pada kurikulum terkait",
          },
          nama_matkul: { type: "string", example: "Pemrograman Web Lanjut" },
          nama_ruang: { type: "string", example: "Lab Software Engineering (LSE)" },
          nama_dosen: { type: "string", example: "Dr. Budi Santoso, M.Kom." },
        },
      },

      JadwalRuangItem: {
        type: "object",
        properties: {
          hari: { type: "string", example: "senin" },
          sesi: {
            type: "array",
            items: { type: "integer" },
            example: [1, 2],
            description: "Nomor urutan sesi terurut (1, 2, 3, ...) pada kurikulum terkait",
          },
          nama_matkul: { type: "string", example: "Pemrograman Web Lanjut" },
          kode_kelas: { type: "string", example: "PL4AA" },
          nama_dosen: { type: "string", example: "Dr. Budi Santoso, M.Kom." },
        },
      },

      PenjadwalanRuangItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nama: { type: "string", example: "CU205" },
          okupansi: { type: "string", example: "20%" },
          jadwal: {
            type: "array",
            items: { $ref: "#/components/schemas/JadwalRuangItem" },
          },
        },
      },

      PenjadwalanKelasItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nama: { type: "string", example: "PL4AA" },
          jadwal: {
            type: "array",
            items: { $ref: "#/components/schemas/JadwalKelasItem" },
          },
        },
      },

      JadwalDosenItem: {
        type: "object",
        properties: {
          hari: { type: "string", example: "senin" },
          sesi: {
            type: "array",
            items: { type: "integer" },
            example: [1, 2],
            description: "Nomor urutan sesi terurut (1, 2, 3, ...) pada kurikulum terkait",
          },
          nama_matkul: { type: "string", example: "Pemrograman Web Lanjut" },
          kode_kelas: { type: "string", example: "PL4AA" },
          nama_ruang: { type: "string", example: "Lab Software Engineering (LSE)" },
        },
      },

      PenjadwalanDosenItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nama: { type: "string", example: "Dr. Budi Santoso, M.Kom." },
          beban_sks: { type: "integer", example: 6 },
          jadwal: {
            type: "array",
            items: { $ref: "#/components/schemas/JadwalDosenItem" },
          },
        },
      },

      PenjadwalanCreatePayload: {
        type: "object",
        required: ["kurikulum_id", "matkul_id", "ruang_id", "kelas_id", "hari"],
        properties: {
          kurikulum_id: { type: "integer", example: 1 },
          matkul_id: { type: "integer", example: 5 },
          ruang_id: { type: "integer", example: 3 },
          kelas_id: { type: "integer", example: 2 },
          hari: {
            type: "string",
            enum: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
            example: "Senin",
          },
          sesi_ids: {
            type: "array",
            items: { type: "integer" },
            example: [1, 2],
            description: "Array ID sesi (atau bisa dikirimkan berupa `sesi_id: [1, 2]` maupun single integer `sesi_id: 1`)",
          },
          dosen_ids: {
            type: "array",
            items: { type: "integer" },
            example: [4, 7],
            description: "Array ID dosen (atau bisa dikirimkan berupa `dosen_id: [4, 7]` maupun single integer `dosen_id: 4`)",
          },
        },
      },

      PenjadwalanUpdatePayload: {
        type: "object",
        required: ["matkul_id", "ruang_id", "kelas_id", "hari"],
        properties: {
          kurikulum_id: { type: "integer", example: 1, description: "Opsional jika tidak ingin mengubah kurikulum" },
          matkul_id: { type: "integer", example: 5 },
          ruang_id: { type: "integer", example: 3 },
          kelas_id: { type: "integer", example: 2 },
          hari: {
            type: "string",
            enum: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
            example: "Senin",
          },
          sesi_ids: {
            type: "array",
            items: { type: "integer" },
            example: [1, 2],
          },
          dosen_ids: {
            type: "array",
            items: { type: "integer" },
            example: [4, 7],
          },
        },
      },

      PenjadwalanDetail: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          kurikulum_id: { type: "integer", example: 1 },
          matkul_id: { type: "integer", example: 5 },
          nama_matkul: { type: "string", example: "Pemrograman Web Lanjut" },
          ruang_id: { type: "integer", example: 3 },
          nama_ruang: { type: "string", example: "CU205" },
          kelas_id: { type: "integer", example: 2 },
          kode_kelas: { type: "string", example: "PL4AA" },
          hari: { type: "string", example: "Senin" },
          sesi_ids: {
            type: "array",
            items: { type: "integer" },
            example: [1, 2],
          },
          sesi: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                jam_mulai: { type: "string", example: "2026-01-01 07:30:00" },
                jam_akhir: { type: "string", example: "2026-01-01 09:10:00" },
              },
            },
          },
          dosen_ids: {
            type: "array",
            items: { type: "integer" },
            example: [4, 7],
          },
          dosen: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 4 },
                nama: { type: "string", example: "Dr. Budi Santoso, M.Kom." },
              },
            },
          },
          nama_dosen: { type: "string", example: "Dr. Budi Santoso, M.Kom., Denis Pratama, M.T." },
        },
      },
    },
    responses: {
      ...globalErrorResponses,
    },
  },
};
