"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Image from "next/image";

export function ImageUpload({ value, onChange, onRemove }) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        setIsUploading(true);
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        onChange(data.url);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div>
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={value}
            alt="Upload"
            className="object-cover"
            fill
          />
          <Button
            onClick={() => onRemove()}
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center hover:bg-accent"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Icons.upload className="h-8 w-8" />
            <div className="text-sm">
              {isDragActive ? (
                <p>Drop the image here</p>
              ) : (
                <p>Drag & drop an image here, or click to select</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
