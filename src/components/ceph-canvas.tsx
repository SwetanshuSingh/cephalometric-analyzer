"use client";

import { useRef, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Text,
  Line,
  Group,
} from "react-konva";
import Konva from "konva";
import { useCephStore } from "@/store/use-store";
import { Point } from "@/types/landmarks";
import { LandmarkMarker } from "./landmark-marker";
import MeasurementLine from "./measurement-line";

const CephCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 1000 });

  const {
    uploadedImage,
    imageDimensions,
    stageScale,
    stagePosition,
    landmarks,
    activeLandmarkId,
    hoveredLandmarkId,
    showLandmarkLabels,
    showMeasurementLines,
    showGrid,
    linearMeasurements,
    setStageScale,
    setStagePosition,
    placeLandmark,
    setHoveredLandmark,
    updateLandmarkPosition,
  } = useCephStore();

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle canvas click for landmark placement
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!activeLandmarkId) return;

    const stage = e.target.getStage();
    if (!stage) return;

    // Get click position relative to stage
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Convert to image coordinates (accounting for zoom and pan)
    const imageX = (pointerPosition.x - stagePosition.x) / stageScale;
    const imageY = (pointerPosition.y - stagePosition.y) / stageScale;

    placeLandmark(activeLandmarkId, { x: imageX, y: imageY });
  };

  // Handle zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };

    // Calculate new scale
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.05;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Clamp scale
    const clampedScale = Math.max(0.1, Math.min(5, newScale));

    // Calculate new position to zoom towards mouse
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    setStageScale(clampedScale);
    setStagePosition(newPos);
  };

  // Handle pan (drag stage)
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setStagePosition({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-900 overflow-hidden"
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={!activeLandmarkId}
        onClick={handleStageClick}
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
      >
        {/* Background Layer - Image */}
        <Layer>
          {uploadedImage && (
            <KonvaImage
              image={uploadedImage}
              width={imageDimensions?.width}
              height={imageDimensions?.height}
            />
          )}

          {/* Grid overlay */}
          {showGrid && imageDimensions && (
            <GridOverlay
              width={imageDimensions.width}
              height={imageDimensions.height}
            />
          )}
        </Layer>

        {/* Measurements Layer */}
        {showMeasurementLines && (
          <Layer>
            {linearMeasurements.map((measurement) => {
              const [id1, id2] = measurement.landmarkIds;
              const point1 = landmarks[id1]?.position;
              const point2 = landmarks[id2]?.position;

              if (!point1 || !point2) return null;

              return (
                <MeasurementLine
                  key={measurement.id}
                  point1={point1}
                  point2={point2}
                  label={`${measurement.value?.toFixed(1)} mm`}
                />
              );
            })}
          </Layer>
        )}

        {/* Landmarks Layer */}
        <Layer>
          {Object.values(landmarks).map((landmark) => {
            if (!landmark.position) return null;

            return (
              <LandmarkMarker
                key={landmark.id}
                landmark={landmark}
                isActive={activeLandmarkId === landmark.id}
                isHovered={hoveredLandmarkId === landmark.id}
                showLabel={showLandmarkLabels}
                onDragEnd={(newPos) =>
                  updateLandmarkPosition(landmark.id, newPos)
                }
                onMouseEnter={() => setHoveredLandmark(landmark.id)}
                onMouseLeave={() => setHoveredLandmark(null)}
              />
            );
          })}
        </Layer>
      </Stage>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setStageScale(Math.min(5, stageScale * 1.2))}
          className="bg-white p-2 rounded shadow hover:bg-gray-100"
        >
          +
        </button>
        <button
          onClick={() => setStageScale(1)}
          className="bg-white p-2 rounded shadow hover:bg-gray-100 text-xs"
        >
          Reset
        </button>
        <button
          onClick={() => setStageScale(Math.max(0.1, stageScale / 1.2))}
          className="bg-white p-2 rounded shadow hover:bg-gray-100"
        >
          −
        </button>
      </div>

      {/* Instructions overlay */}
      {activeLandmarkId && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
          Click on the image to place: {landmarks[activeLandmarkId]?.name}
        </div>
      )}
    </div>
  );
};

// Grid component
const GridOverlay: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const gridSize = 50;
  const lines: JSX.Element[] = [];

  // Vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i, 0, i, height]}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={1}
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, i, width, i]}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={1}
      />
    );
  }

  return <>{lines}</>;
};

export default CephCanvas;
