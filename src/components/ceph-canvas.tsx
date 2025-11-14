import { useEffect, useRef } from "react";

import { Landmark } from "@/types/landmarks";
import { AngularMeasurement, LinearMeasurement } from "@/types/measurements";

type CephState = {
  uploadedImage: string | null;
  imageScale: number;
  landmarks: Record<string, Landmark>;
  activeLandmark: string | null;
  linearMeasurements: LinearMeasurement[];
  angularMeasurements: AngularMeasurement[];
};

type CephCanvasProps = {
  state: CephState | undefined;
  setState: React.Dispatch<React.SetStateAction<CephState | undefined>>;
};

const CephCanvas = ({ state, setState }: CephCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="canvas-container w-[800px] h-[800px] border border-white/80">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default CephCanvas;
