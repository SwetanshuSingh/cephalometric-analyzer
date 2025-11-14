import { Landmark } from "@/types/landmarks";

export const LANDMARKS: Record<string, Omit<Landmark, "position">> = {
  sella: {
    id: "sella",
    name: "Sella",
    abbreviation: "S",
    description: "Center of pituitary fossa (sella turcica)",
    category: "skeletal",
  },
  nasion: {
    id: "nasion",
    name: "Nasion",
    abbreviation: "N",
    description: "Most anterior point of frontonasal suture",
    category: "skeletal",
  },
  // Define all 30+ landmarks here
};
