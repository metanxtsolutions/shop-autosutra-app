"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

async function uploadToCloudinary(file: File) {
  const signRes = await fetch("/api/cloudinary-sign");
  if (!signRes.ok) throw new Error("Not authorized to upload images.");
  const { signature, timestamp, folder, cloudName, apiKey } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("api_key", apiKey);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  if (!uploadRes.ok) throw new Error("Upload failed.");
  const data = await uploadRes.json();
  return data.secure_url as string;
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file)),
      );
      onChange([...images, ...uploaded]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative size-24 overflow-hidden rounded-md border border-border">
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((i) => i !== url))}
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-background/90"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex size-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:border-foreground"
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          Add image
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
