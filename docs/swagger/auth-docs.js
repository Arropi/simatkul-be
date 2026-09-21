export const authSwaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "SIMATKUL API - Auth Module",
    version: "1.0.0",
    description: `Dokumentasi API SIMATKUL untuk **Modul Autentikasi** dan Manajemen Sesi Pengguna berbasis JSON Web Token (JWT).

---

### ⚠️ Format Penjelasan Error Response Global (\`middleware/error-middleware.js\`)
Setiap kegagalan request (validasi Zod, kredensial salah, token expired, dsb.) menghasilkan format JSON standar:
\`\`\`json
{
  "message": "Deskripsi pesan kesalahan"
}
\`\`\`
- **\`400 Bad Request\`**: Validasi input gagal (misal: \`"Field Username Cannot Be Empty"\` atau request body kosong).
- **\`401 Unauthorized\`**: Kredensial tidak valid (\`"Invalid username or password"\`).
- **\`403 Forbidden\`**: Akses ditolak karena role pengguna bukan \`admin\`.
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
      name: "Auth",
      description: "Operasi otentikasi akun pengguna dan penerbitan token JWT",
    },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login pengguna",
        description:
          "Mengotentikasi pengguna menggunakan username dan password. Jika berhasil, server akan mengembalikan JWT token dan informasi dasar pengguna.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login berhasil",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request: Data tidak valid atau request body kosong",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                examples: {
                  emptyBody: {
                    summary: "Body kosong",
                    value: {
                      message: "Bad Request: No data provided",
                    },
                  },
                  emptyUsername: {
                    summary: "Username kosong",
                    value: {
                      message: "Field Username Cannot Be Empty",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized: Username atau password tidak cocok",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  message: "Invalid username or password",
                },
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
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: {
            type: "string",
            description: "Username pengguna",
            example: "admin",
          },
          password: {
            type: "string",
            format: "password",
            description: "Password akun pengguna",
            example: "rahasia123",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          username: {
            type: "string",
            example: "admin",
          },
          role: {
            type: "string",
            enum: ["admin", "user"],
            example: "admin",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Login successfully",
          },
          token: {
            type: "string",
            description: "JSON Web Token yang digunakan untuk Authorization header",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0...",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Error message details",
          },
        },
      },
    },
  },
};
