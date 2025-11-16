import { create } from "zustand";
import { Landmark, Point } from "@/types/landmarks";
import { AngularMeasurement, LinearMeasurement } from "@/types/measurements";
import { LANDMARK_DEFINITIONS } from "@/lib/landmark-definitions";
import {
  calculateLinearMeasurements,
  calculateAngularMeasurements,
} from "@/utils/calculations";

interface CephState {
  // Image state
  uploadedImage: HTMLImageElement | null;
  imageData: string | null;
  imageDimensions: { width: number; height: number } | null;
  imageScale: number; // pixels per mm
  isCalibrated: boolean;

  // Canvas state
  stageScale: number;
  stagePosition: Point;

  // Landmarks
  landmarks: Record<string, Landmark>;
  activeLandmarkId: string | null;
  hoveredLandmarkId: string | null;

  // Measurements
  linearMeasurements: LinearMeasurement[];
  angularMeasurements: AngularMeasurement[];
  selectedAnalysis: "steiner" | "downs" | "mcnamara";

  // UI state
  showLandmarkLabels: boolean;
  showMeasurementLines: boolean;
  showGrid: boolean;

  // History (for undo/redo)
  history: Array<Record<string, Landmark>>;
  historyIndex: number;

  calibrationMode: boolean;
}

interface CephActions {
  // Image actions
  setImage: (imageData: string) => Promise<void>;
  clearImage: () => void;
  setImageScale: (scale: number) => void;

  // Canvas actions
  setStageScale: (scale: number) => void;
  setStagePosition: (position: Point) => void;

  // Landmark actions
  setActiveLandmark: (id: string | null) => void;
  setHoveredLandmark: (id: string | null) => void;
  placeLandmark: (id: string, position: Point) => void;
  updateLandmarkPosition: (id: string, position: Point) => void;
  removeLandmark: (id: string) => void;
  clearAllLandmarks: () => void;

  // Measurement actions
  calculateAllMeasurements: () => void;
  setSelectedAnalysis: (analysis: "steiner" | "downs" | "mcnamara") => void;

  // UI actions
  toggleLandmarkLabels: () => void;
  toggleMeasurementLines: () => void;
  toggleGrid: () => void;

  // History actions
  undo: () => void;
  redo: () => void;

  // Utility
  reset: () => void;

  setCalibrationMode: (mode: boolean) => void;
}

const initialLandmarks = Object.entries(LANDMARK_DEFINITIONS).reduce(
  (acc, [id, definition]) => {
    acc[id] = { ...definition, position: null };
    return acc;
  },
  {} as Record<string, Landmark>
);

export const useCephStore = create<CephState & CephActions>((set, get) => ({
  // Initial state
  uploadedImage: null,
  imageData: null,
  imageDimensions: null,
  imageScale: 1,
  isCalibrated: false,
  stageScale: 1,
  stagePosition: { x: 0, y: 0 },
  landmarks: initialLandmarks,
  activeLandmarkId: null,
  hoveredLandmarkId: null,
  linearMeasurements: [],
  angularMeasurements: [],
  selectedAnalysis: "steiner",
  showLandmarkLabels: true,
  showMeasurementLines: true,
  showGrid: false,
  history: [initialLandmarks],
  historyIndex: 0,
  calibrationMode: false,

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
      landmarks: initialLandmarks,
      linearMeasurements: [],
      angularMeasurements: [],
      history: [initialLandmarks],
      historyIndex: 0,
    });
  },

  setImageScale: (scale: number) => {
    set({ imageScale: scale, isCalibrated: true });
    get().calculateAllMeasurements();
  },

  setStageScale: (scale: number) => set({ stageScale: scale }),

  setStagePosition: (position: Point) => set({ stagePosition: position }),

  setActiveLandmark: (id: string | null) => set({ activeLandmarkId: id }),

  setHoveredLandmark: (id: string | null) => set({ hoveredLandmarkId: id }),

  placeLandmark: (id: string, position: Point) => {
    const { landmarks, history, historyIndex } = get();
    const newLandmarks = {
      ...landmarks,
      [id]: { ...landmarks[id], position },
    };

    // Update history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newLandmarks);

    set({
      landmarks: newLandmarks,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      activeLandmarkId: null, // Deselect after placing
    });

    get().calculateAllMeasurements();
  },

  updateLandmarkPosition: (id: string, position: Point) => {
    const { landmarks } = get();
    set({
      landmarks: {
        ...landmarks,
        [id]: { ...landmarks[id], position },
      },
    });
    get().calculateAllMeasurements();
  },

  removeLandmark: (id: string) => {
    const { landmarks, history, historyIndex } = get();
    const newLandmarks = {
      ...landmarks,
      [id]: { ...landmarks[id], position: null },
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newLandmarks);

    set({
      landmarks: newLandmarks,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });

    get().calculateAllMeasurements();
  },

  clearAllLandmarks: () => {
    set({
      landmarks: initialLandmarks,
      linearMeasurements: [],
      angularMeasurements: [],
      history: [initialLandmarks],
      historyIndex: 0,
    });
  },

  calculateAllMeasurements: () => {
    const { landmarks, imageScale, selectedAnalysis, isCalibrated } = get();

    if (!isCalibrated) return;

    const linear = calculateLinearMeasurements(
      landmarks,
      imageScale,
      selectedAnalysis
    );
    const angular = calculateAngularMeasurements(landmarks, selectedAnalysis);

    set({
      linearMeasurements: linear,
      angularMeasurements: angular,
    });
  },

  setSelectedAnalysis: (analysis) => {
    set({ selectedAnalysis: analysis });
    get().calculateAllMeasurements();
  },

  toggleLandmarkLabels: () => {
    set((state) => ({ showLandmarkLabels: !state.showLandmarkLabels }));
  },

  toggleMeasurementLines: () => {
    set((state) => ({ showMeasurementLines: !state.showMeasurementLines }));
  },

  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        landmarks: history[newIndex],
        historyIndex: newIndex,
      });
      get().calculateAllMeasurements();
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        landmarks: history[newIndex],
        historyIndex: newIndex,
      });
      get().calculateAllMeasurements();
    }
  },

  reset: () => {
    set({
      landmarks: initialLandmarks,
      activeLandmarkId: null,
      hoveredLandmarkId: null,
      linearMeasurements: [],
      angularMeasurements: [],
      history: [initialLandmarks],
      historyIndex: 0,
    });
  },

  setCalibrationMode: (mode: boolean) => set({ calibrationMode: mode }),
}));
