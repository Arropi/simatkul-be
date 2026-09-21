import { z } from "zod";

/**
 * Zod Schema untuk format error response global
 * Sesuai dengan middleware/error-middleware.js
 */
export const globalErrorSchema = z.object({
  message: z.string().describe("Deskripsi pesan kesalahan terstandarisasi"),
});
