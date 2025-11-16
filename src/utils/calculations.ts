import { Landmark, Point, LandmarkId } from "@/types/landmarks";
import { LinearMeasurement, AngularMeasurement } from "@/types/measurements";
import {
  STEINER_ANALYSIS,
  DOWNS_ANALYSIS,
  MCNAMARA_ANALYSIS,
} from "@/lib/analysis-definitions";

/**
 * Calculate Euclidean distance between two points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculate angle formed by three points (in degrees)
 * @param p1 - First point
 * @param vertex - Vertex point (center of angle)
 * @param p3 - Third point
 * @returns Angle in degrees (0-360)
 */
export const calculateAngle = (p1: Point, vertex: Point, p3: Point): number => {
  // Create vectors from vertex to p1 and p3
  const vector1 = {
    x: p1.x - vertex.x,
    y: p1.y - vertex.y,
  };
  const vector2 = {
    x: p3.x - vertex.x,
    y: p3.y - vertex.y,
  };

  // Calculate angle using atan2
  const angle1 = Math.atan2(vector1.y, vector1.x);
  const angle2 = Math.atan2(vector2.y, vector2.x);

  // Get difference and convert to degrees
  let angleDiff = (angle2 - angle1) * (180 / Math.PI);

  // Normalize to 0-360
  if (angleDiff < 0) angleDiff += 360;

  return angleDiff;
};

/**
 * Calculate the interior angle (0-180 degrees)
 */
export const calculateInteriorAngle = (
  p1: Point,
  vertex: Point,
  p3: Point
): number => {
  const vector1 = {
    x: p1.x - vertex.x,
    y: p1.y - vertex.y,
  };
  const vector2 = {
    x: p3.x - vertex.x,
    y: p3.y - vertex.y,
  };

  // Dot product
  const dot = vector1.x * vector2.x + vector1.y * vector2.y;

  // Magnitudes
  const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

  // Calculate angle
  const cosAngle = dot / (mag1 * mag2);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))); // Clamp for numerical stability

  return angle * (180 / Math.PI);
};

/**
 * Check if all required landmarks are placed
 */
export const areLandmarksPlaced = (
  landmarks: Record<string, Landmark>,
  landmarkIds: LandmarkId[]
): boolean => {
  return landmarkIds.every((id) => landmarks[id]?.position !== null);
};

/**
 * Calculate all linear measurements for a given analysis
 */
export const calculateLinearMeasurements = (
  landmarks: Record<string, Landmark>,
  imageScale: number,
  analysisType: "steiner" | "downs" | "mcnamara"
): LinearMeasurement[] => {
  const analysis =
    analysisType === "steiner"
      ? STEINER_ANALYSIS
      : analysisType === "downs"
      ? DOWNS_ANALYSIS
      : MCNAMARA_ANALYSIS;
  const measurements: LinearMeasurement[] = [];

  for (const measurementDef of analysis.measurements.linear) {
    const [id1, id2] = measurementDef.landmarkIds;

    if (!areLandmarksPlaced(landmarks, [id1, id2])) {
      measurements.push({
        ...measurementDef,
        value: null,
      });
      continue;
    }

    const point1 = landmarks[id1].position!;
    const point2 = landmarks[id2].position!;

    const pixelDistance = calculateDistance(point1, point2);
    const mmDistance = pixelDistance / imageScale;

    measurements.push({
      ...measurementDef,
      value: mmDistance,
    });
  }

  return measurements;
};

/**
 * Calculate all angular measurements for a given analysis
 */
export const calculateAngularMeasurements = (
  landmarks: Record<string, Landmark>,
  analysisType: "steiner" | "downs" | "mcnamara"
): AngularMeasurement[] => {
  const analysis =
    analysisType === "steiner"
      ? STEINER_ANALYSIS
      : analysisType === "downs"
      ? DOWNS_ANALYSIS
      : MCNAMARA_ANALYSIS;
  const measurements: AngularMeasurement[] = [];

  for (const measurementDef of analysis.measurements.angular) {
    const [id1, vertexId, id3] = measurementDef.landmarkIds;

    if (!areLandmarksPlaced(landmarks, [id1, vertexId, id3])) {
      measurements.push({
        ...measurementDef,
        value: null,
      });
      continue;
    }

    const point1 = landmarks[id1].position!;
    const vertex = landmarks[vertexId].position!;
    const point3 = landmarks[id3].position!;

    const angle = calculateInteriorAngle(point1, vertex, point3);

    measurements.push({
      ...measurementDef,
      value: angle,
    });
  }

  return measurements;
};

/**
 * Specific calculation functions for common measurements
 */

// SNA: Sella-Nasion-A Point angle
export const calculateSNA = (
  landmarks: Record<string, Landmark>
): number | null => {
  if (!areLandmarksPlaced(landmarks, ["sella", "nasion", "a-point"])) {
    return null;
  }

  const sella = landmarks["sella"].position!;
  const nasion = landmarks["nasion"].position!;
  const aPoint = landmarks["a-point"].position!;

  return calculateInteriorAngle(sella, nasion, aPoint);
};

// SNB: Sella-Nasion-B Point angle
export const calculateSNB = (
  landmarks: Record<string, Landmark>
): number | null => {
  if (!areLandmarksPlaced(landmarks, ["sella", "nasion", "b-point"])) {
    return null;
  }

  const sella = landmarks["sella"].position!;
  const nasion = landmarks["nasion"].position!;
  const bPoint = landmarks["b-point"].position!;

  return calculateInteriorAngle(sella, nasion, bPoint);
};

// ANB: Difference between SNA and SNB
export const calculateANB = (
  sna: number | null,
  snb: number | null
): number | null => {
  if (sna === null || snb === null) return null;
  return sna - snb;
};

// Facial Angle (Downs)
export const calculateFacialAngle = (
  landmarks: Record<string, Landmark>
): number | null => {
  if (!areLandmarksPlaced(landmarks, ["nasion", "pogonion", "porion"])) {
    return null;
  }

  const nasion = landmarks["nasion"].position!;
  const pogonion = landmarks["pogonion"].position!;
  const porion = landmarks["porion"].position!;

  return calculateInteriorAngle(nasion, pogonion, porion);
};

// Mandibular Plane Angle
export const calculateMandibularPlaneAngle = (
  landmarks: Record<string, Landmark>
): number | null => {
  if (!areLandmarksPlaced(landmarks, ["gonion", "menton", "sella", "nasion"])) {
    return null;
  }

  // This would need more complex calculation involving plane intersections
  // Simplified version here
  const gonion = landmarks["gonion"].position!;
  const menton = landmarks["menton"].position!;
  const sella = landmarks["sella"].position!;
  const nasion = landmarks["nasion"].position!;

  // Calculate angle between mandibular plane (Go-Me) and SN plane
  // This is a simplified calculation
  return calculateInteriorAngle(gonion, menton, nasion);
};

/**
 * Validate measurement against normal range
 */
export const validateMeasurement = (
  value: number,
  normalRange: { min: number; max: number }
): "low" | "normal" | "high" => {
  if (value < normalRange.min) return "low";
  if (value > normalRange.max) return "high";
  return "normal";
};

/**
 * Get interpretation text for a measurement
 */
export const getInterpretation = (measurement: AngularMeasurement): string => {
  if (measurement.value === null) return "Not calculated";

  const status = validateMeasurement(
    measurement.value,
    measurement.normalRange
  );
  return measurement.interpretation[status];
};

/**
 * Calculate skeletal classification based on ANB
 */
export const getSkeletalClass = (anb: number | null): string => {
  if (anb === null) return "Cannot determine";

  if (anb < 0) return "Class III (Skeletal underbite)";
  if (anb <= 4) return "Class I (Normal skeletal relationship)";
  return "Class II (Skeletal overbite)";
};

/**
 * Calculate perpendicular distance from point to line
 */
export const pointToLineDistance = (
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number => {
  const numerator = Math.abs(
    (lineEnd.y - lineStart.y) * point.x -
      (lineEnd.x - lineStart.x) * point.y +
      lineEnd.x * lineStart.y -
      lineEnd.y * lineStart.x
  );

  const denominator = Math.sqrt(
    Math.pow(lineEnd.y - lineStart.y, 2) + Math.pow(lineEnd.x - lineStart.x, 2)
  );

  return numerator / denominator;
};
