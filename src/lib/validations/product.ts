import { z } from "zod";

export const productSlugSchema = z.object({
  slug: z.string().min(2).max(120),
});
