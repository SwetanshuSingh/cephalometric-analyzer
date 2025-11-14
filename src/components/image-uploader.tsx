"use client";

import React, { useCallback, useState } from "react";

type ImageUploaderProps = {
  setImage: (image: string) => void;
};

export const ImageUploader = ({ setImage }: ImageUploaderProps) => {
  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setImage]
  );

  return (
    <div className="upload-container">
      <input type="file" accept="image/*" onChange={handleUpload} />
      <p>Upload a lateral cephalometric X-ray</p>
    </div>
  );
};
