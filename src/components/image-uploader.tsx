"use client";

import { useCephStore } from "@/store/use-store";
import { Upload, X } from "lucide-react";
import { useCallback, useRef } from "react";

const ImageUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { imageData, setImage, clearImage } = useCephStore();

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target?.files?.[0];

      if (!file) return;

      // Validate File Type
      if (!file.type.startsWith("image/")) {
        alert("Please uplaod an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event?.target?.result as string;
        await setImage(result);
      };

      reader.onerror = () => {
        alert("Error reading file");
      };

      reader.readAsDataURL(file);
    },
    [setImage]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the image and all landmarks?"
      )
    ) {
      clearImage();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (imageData) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Image loaded</p>
          <p className="text-xs text-gray-500">Ready for landmark placement</p>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          <X size={16} />
          Clear
        </button>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
      // onDrop={handleDrop}
      // onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Upload className="mx-auto mb-4 text-gray-400" size={48} />

      <h3 className="text-lg font-semibold mb-2">Upload Cephalometric X-ray</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click to browse or drag and drop your lateral cephalometric radiograph
      </p>

      <div className="text-xs text-gray-500">
        <p>Supported formats: JPG, PNG, BMP</p>
        <p>Maximum file size: 10MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;
