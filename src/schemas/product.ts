import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  sku: z.string().trim().min(1, "SKU is required"),
  description: z.string().trim().min(1, "Description is required"),
  images: z.array(z.string().url()).default([]),
  price: z.coerce.number().positive("Price must be positive"),
  mrp: z.coerce.number().positive("MRP must be positive"),
  gstPercent: z.coerce.number().min(0).max(100).default(18),
  stock: z.coerce.number().int().min(0).default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  tags: z.array(z.string()).default([]),
});

// Form values are the pre-coercion input shape (price/stock arrive as
// strings from <input> elements); productSchema.safeParse() coerces them
// to numbers at the server action boundary.
export type ProductFormValues = z.input<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().trim().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  parentId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
