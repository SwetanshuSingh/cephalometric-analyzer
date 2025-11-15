import { create } from "zustand";

interface CephState {
  // Image State
  uploadedImage: HTMLImageElement | null;
  imageData: string | null;
  imageDimensions: { width: number; height: number } | null;
  imageScale: number;
  isCalibrated: boolean;
}

interface CephActions {
  // Image Actions
  setImage: (imageData: string) => Promise<void>;
  clearImage: () => void;
  setImageScale: (scale: number) => void;

  // Measurement Actions
}

export const useCephStore = create<CephState & CephActions>((set, get) => ({
  // Initial State
  uploadedImage: null,
  imageData: null,
  imageDimensions: null,
  imageScale: 1,
  isCalibrated: false,

  // Actions
  setImage: async (imageData: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        set({
          uploadedImage: img,
          imageData,
          imageDimensions: { width: img.width, height: img.height },
        });
        resolve();
      };
      img.src = imageData;
    });
  },

  clearImage: () => {
    set({
      uploadedImage: null,
      imageData: null,
      imageDimensions: null,
      imageScale: 1,
      isCalibrated: false,
    });
  },

  setImageScale: (scale: number) => {
    set({ imageScale: scale, isCalibrated: true });
    // TODO: Implement calculate all measurements function
  },
}));
