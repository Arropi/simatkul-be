/**
 * OpenAPI schema definisi untuk Error Response Global
 * Sesuai dengan middleware/error-middleware.js
 */
export const globalErrorSchemas = {
  GlobalErrorResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        description: "Pesan deskripsi kesalahan terstandarisasi yang dikembalikan oleh server (error-middleware.js)",
        example: "Internal Server Error",
      },
    },
  },
  ValidationErrorResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        description: "Pesan kesalahan validasi input data atau parameter (HTTP 400)",
        example: "Field nama tidak boleh kosong",
      },
    },
  },
  UnauthorizedErrorResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        description: "Pesan kesalahan autentikasi atau token tidak valid (HTTP 401)",
        example: "Invalid username or password",
      },
    },
  },
  ForbiddenErrorResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        description: "Pesan kesalahan hak akses pengguna (HTTP 403)",
        example: "Akses ditolak: role pengguna bukan admin",
      },
    },
  },
  NotFoundErrorResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        description: "Pesan kesalahan data atau resource tidak ditemukan (HTTP 404)",
        example: "Data tidak ditemukan",
      },
    },
  },
  InternalServerErrorResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        description: "Pesan kesalahan sistem/internal server (HTTP 500)",
        example: "Internal Server Error",
      },
    },
  },
};

export const globalErrorResponses = {
  BadRequest: {
    description: "Bad Request - Validasi input gagal atau parameter tidak valid",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/GlobalErrorResponse",
        },
        examples: {
          validationError: {
            summary: "Validasi field kosong",
            value: { message: "Field nama tidak boleh kosong" },
          },
          invalidId: {
            summary: "Parameter ID tidak valid",
            value: { message: "Parameter ID harus berupa angka integer positif" },
          },
        },
      },
    },
  },
  Unauthorized: {
    description: "Unauthorized - Token tidak valid atau kredensial salah",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/GlobalErrorResponse",
        },
        example: {
          message: "Invalid username or password",
        },
      },
    },
  },
  Forbidden: {
    description: "Forbidden - Pengguna tidak memiliki izin akses (role bukan admin)",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/GlobalErrorResponse",
        },
        example: {
          message: "Akses ditolak: role pengguna bukan admin",
        },
      },
    },
  },
  NotFound: {
    description: "Not Found - Data yang diminta tidak ditemukan",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/GlobalErrorResponse",
        },
        example: {
          message: "Data tidak ditemukan",
        },
      },
    },
  },
  InternalServerError: {
    description: "Internal Server Error - Terjadi kesalahan tak terduga pada server",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/GlobalErrorResponse",
        },
        example: {
          message: "Internal Server Error",
        },
      },
    },
  },
};
