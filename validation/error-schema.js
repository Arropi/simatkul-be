import { z } from "zod";

export const globalErrorSchema = z.object({
  message: z.string().describe("Deskripsi pesan kesalahan terstandarisasi"),
});
