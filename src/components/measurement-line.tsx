import { Group, Line, Text } from "react-konva";
import { Point } from "@/types/landmarks";

interface MeasurementLineProps {
  point1: Point;
  point2: Point;
  label: string;
  color?: string;
}

const MeasurementLine = ({
  point1,
  point2,
  label,
  color = "#00ff00",
}: MeasurementLineProps) => {
  const midpoint = {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
  };

  return (
    <Group>
      <Line
        points={[point1.x, point1.y, point2.x, point2.y]}
        stroke={color}
        strokeWidth={1}
        dash={[5, 5]}
        opacity={0.7}
      />
      <Text
        text={label}
        x={midpoint.x + 5}
        y={midpoint.y - 10}
        fontSize={11}
        fill="white"
        stroke="black"
        strokeWidth={0.3}
      />
    </Group>
  );
};

export default MeasurementLine;
