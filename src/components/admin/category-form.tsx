"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema, type CategoryFormValues } from "@/schemas/product";
import { createCategory } from "@/actions/admin-categories";

export function CategoryForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    const result = await createCategory(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      reset();
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} className="w-48" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" {...register("slug")} className="w-48" placeholder="category-name" />
        {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="gap-2">
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Add category
      </Button>
    </form>
  );
}
