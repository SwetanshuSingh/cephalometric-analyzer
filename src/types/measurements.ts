import { LandmarkId } from "./landmarks";

export interface LinearMeasurement {
  id: string;
  name: string;
  description: string;
  landmarkIds: [LandmarkId, LandmarkId];
  value: number | null;
  unit: "mm";
  normalRange: { min: number; max: number };
}

export interface AngularMeasurement {
  id: string;
  name: string;
  description: string;
  landmarkIds: [LandmarkId, LandmarkId, LandmarkId]; // [point1, vertex, point3]
  value: number | null;
  unit: "degrees";
  normalRange: { min: number; max: number };
  interpretation: {
    low: string;
    normal: string;
    high: string;
  };
}

export interface Analysis {
  id: string;
  name: string;
  description: string;
  requiredLandmarks: LandmarkId[];
  measurements: {
    angular: AngularMeasurement[];
    linear: LinearMeasurement[];
  };
}
