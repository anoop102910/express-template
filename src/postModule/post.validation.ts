import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must not exceed 5000 characters"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>; 