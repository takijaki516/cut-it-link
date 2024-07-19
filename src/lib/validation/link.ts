import { z } from "zod";
import { slugRegex } from "../utils";

export const insertLinkSchema = z.object({
  slug: z
    .string()
    .max(30, "Maximum 30 characters allowed")
    .refine((value) => slugRegex.test(value), {
      message:
        "Slugs can only contain letters, numbers, hyphens, and underscores",
    }),
  url: z.string().url(),
  description: z.string().max(255, "Maximum 255 characters allowed."),
});

// REVIEW:
export const editLinkSchema = z.object({
  slug: z.string(),
  newLink: insertLinkSchema,
});
