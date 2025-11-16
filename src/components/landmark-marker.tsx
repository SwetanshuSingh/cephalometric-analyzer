"use client";

import { Group, Circle, Text } from "react-konva";
import { Landmark, Point } from "@/types/landmarks";
import Konva from "konva";

interface LandmarkMarkerProps {
  landmark: Landmark;
  isActive: boolean;
  isHovered: boolean;
  showLabel: boolean;
  onDragEnd: (newPos: Point) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const LandmarkMarker = ({
  landmark,
  isActive,
  isHovered,
  showLabel,
  onDragEnd,
  onMouseEnter,
  onMouseLeave,
}: LandmarkMarkerProps) => {
  if (!landmark.position) return null;

  const radius = isActive ? 6 : isHovered ? 5 : 4;
  const strokeWidth = isActive ? 2 : 1;

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragEnd({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Group
      x={landmark.position.x}
      y={landmark.position.y}
      draggable
      onDragEnd={handleDragEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Outer circle for better visibility */}
      <Circle radius={radius + 2} fill="white" opacity={0.3} />

      {/* Main marker */}
      <Circle
        radius={radius}
        fill={landmark.color}
        stroke="white"
        strokeWidth={strokeWidth}
      />

      {/* Crosshair for precision */}
      <Circle radius={1} fill="white" />

      {/* Label */}
      {showLabel && (
        <Text
          text={landmark.abbreviation}
          fontSize={12}
          fontStyle="bold"
          fill="yellow"
          stroke="black"
          strokeWidth={0.5}
          x={8}
          y={-6}
        />
      )}

      {/* Tooltip on hover */}
      {isHovered && (
        <Text
          text={landmark.name}
          fontSize={10}
          fill="white"
          x={8}
          y={8}
          padding={4}
          background="#000"
        />
      )}
    </Group>
  );
};

export default LandmarkMarker;
