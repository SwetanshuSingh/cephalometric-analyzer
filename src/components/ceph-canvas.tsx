"use client";

import { useCephStore } from "@/store/use-store";
import Konva from "konva";
import { useRef, useState } from "react";
import { Layer, Stage, Image as KonvaImage } from "react-konva";

const CephCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 1000 });

  const { uplaodedImage, imageDimensions } = useCephStore();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-900 overflow-hidden"
    >
      <Stage ref={stageRef} width={dimensions.width} height={dimensions.height}>
        {/* Background Layer - Image */}
        <Layer>
          {uplaodedImage && (
            <KonvaImage
              image={uplaodedImage}
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
