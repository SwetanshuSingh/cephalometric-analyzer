"use client";
import type Konva from "konva";
import { useCephStore } from "@/store/use-store";
import { useRef, useState } from "react";
import { Layer, Stage, Image as KonvaImage } from "react-konva";

const CephCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  const { uploadedImage, imageDimensions } = useCephStore();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex justify-center items-center"
    >
      <Stage ref={stageRef} width={dimensions.width} height={dimensions.height}>
        {/* Background Layer - Image */}
        <Layer>
          {uploadedImage && (
            <KonvaImage
              image={uploadedImage}
              width={imageDimensions?.width}
              height={imageDimensions?.height}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CephCanvas;
