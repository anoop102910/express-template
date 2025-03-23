import { z } from "zod";

export const googleAuthSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
});

