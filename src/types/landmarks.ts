export interface Point {
  x: number;
  y: number;
}

export interface Landmark {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  position: Point | null;
  category: "skeletal" | "dental" | "soft-tissue";
}

export type LandmarkType =
  | "Sella"
  | "Nasion"
  | "A-Point"
  | "B-Point"
  | "Pogonion"
  | "Menton"
  | "Gonion"
  | "Orbitale";
