import { Landmark, Point } from "@/types/landmarks";
import { AngularMeasurement, LinearMeasurement } from "@/types/measurements";
import { create } from "zustand";

interface CephState {
  // Image
  uploadedImage: string | null;
  imageScale: number; // pixels per mm

  // Landmarks
  landmarks: Record<string, Landmark>;
  activeLandmark: string | null;

  // Measurements
  linearMeasurements: LinearMeasurement[];
  angularMeasurements: AngularMeasurement[];

  // Actions
  setImage: (image: string) => void;
  setImageScale: (scale: number) => void;
  placeLandmark: (id: string, position: Point) => void;
  removeLandmark: (id: string) => void;
  setActiveLandmark: (id: string | null) => void;
  calculateMeasurements: () => void;
  resetAnalysis: () => void;
}

export const useStore = create<CephState>((set, get) => ({
  // Initial state
  uploadedImage: null,
  imageScale: 1,
  landmarks: initializeLandmarks(),
  activeLandmark: null,
  linearMeasurements: [],
  angularMeasurements: [],

  // Actions implementation
  setImage: (image) => set({ uploadedImage: image }),
  // ... implement other actions
}));
