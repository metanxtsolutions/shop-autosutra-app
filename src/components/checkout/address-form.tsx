"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAddress } from "@/actions/addresses";
import { addressSchema, type AddressFormValues } from "@/schemas/address";

export function AddressForm({ onSaved }: { onSaved: (addressId: string) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema) });

  async function onSubmit(values: AddressFormValues) {
    setIsSubmitting(true);
    const result = await createAddress(values);
    setIsSubmitting(false);
    if (result.success && result.address) {
      toast.success(result.message);
      onSaved(result.address.id);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="line1">Address</Label>
        <Input id="line1" {...register("line1")} />
        {errors.line1 && (
          <p className="text-xs text-destructive">{errors.line1.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
        <Input id="line2" {...register("line2")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state")} />
          {errors.state && (
            <p className="text-xs text-destructive">{errors.state.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">PIN code</Label>
          <Input id="postalCode" {...register("postalCode")} />
          {errors.postalCode && (
            <p className="text-xs text-destructive">{errors.postalCode.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="gap-2">
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Save address
      </Button>
    </form>
  );
}
