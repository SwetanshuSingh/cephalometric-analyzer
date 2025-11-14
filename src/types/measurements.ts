export interface LinearMeasurement {
  id: string;
  name: string;
  points: [string, string]; // landmark IDs
  value: number | null;
  unit: "mm";
  normalRange: { min: number; max: number };
}

export interface AngularMeasurement {
  id: string;
  name: string;
  points: [string, string, string]; // 3 landmark IDs
  value: number | null;
  unit: "degrees";
  normalRange: { min: number; max: number };
}
