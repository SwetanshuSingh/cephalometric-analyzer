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
  color: string;
}

export type LandmarkId =
  | "sella"
  | "nasion"
  | "a-point"
  | "b-point"
  | "pogonion"
  | "menton"
  | "gonion"
  | "orbitale"
  | "porion"
  | "gnathion"
  | "anterior-nasal-spine"
  | "posterior-nasal-spine"
  | "upper-incisor-tip"
  | "lower-incisor-tip"
  | "upper-incisor-root"
  | "lower-incisor-root"
  | "articulare"
  | "basion"