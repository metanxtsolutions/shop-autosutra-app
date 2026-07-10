"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { productSchema, type ProductFormValues } from "@/schemas/product";
import { createProduct, updateProduct } from "@/actions/admin-products";

type Category = { id: string; name: string };

export function ProductForm({
  categories,
  productId,
  defaultValues,
}: {
  categories: Category[];
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: [],
      gstPercent: 18,
      stock: 0,
      status: "DRAFT",
      tags: [],
      ...defaultValues,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    const result = productId
      ? await updateProduct(productId, values)
      : await createProduct(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} placeholder="product-name" />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register("sku")} />
          {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && (
            <p className="text-xs text-destructive">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} {...register("description")} />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageUploader images={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mrp">MRP (₹)</Label>
          <Input id="mrp" type="number" step="0.01" {...register("mrp")} />
          {errors.mrp && <p className="text-xs text-destructive">{errors.mrp.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gstPercent">GST %</Label>
          <Input id="gstPercent" type="number" step="0.01" {...register("gstPercent")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO title (optional)</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO description (optional)</Label>
          <Input id="seoDescription" {...register("seoDescription")} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {productId ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
