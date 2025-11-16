import React, { useMemo } from "react";
import { Check, Circle } from "lucide-react";
import { useCephStore } from "@/store/use-store";
import { Landmark } from "@/types/landmarks";

export const LandmarkPanel: React.FC = () => {
  const {
    landmarks,
    activeLandmarkId,
    hoveredLandmarkId,
    setActiveLandmark,
    removeLandmark,
  } = useCephStore();

  // Group landmarks by category
  const groupedLandmarks = useMemo(() => {
    const groups: Record<string, Landmark[]> = {
      skeletal: [],
      dental: [],
      "soft-tissue": [],
    };

    Object.values(landmarks).forEach((landmark) => {
      groups[landmark.category].push(landmark);
    });

    return groups;
  }, [landmarks]);

  const categoryLabels = {
    skeletal: "Skeletal Landmarks",
    dental: "Dental Landmarks",
    "soft-tissue": "Soft Tissue Landmarks",
  };

  const handleLandmarkClick = (landmarkId: string) => {
    const landmark = landmarks[landmarkId];

    // If already placed, allow removing it
    if (landmark.position) {
      if (window.confirm(`Remove ${landmark.name}?`)) {
        removeLandmark(landmarkId);
      }
      return;
    }

    // Otherwise, activate it for placement
    setActiveLandmark(activeLandmarkId === landmarkId ? null : landmarkId);
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-white">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Landmarks</h2>
        <p className="text-sm text-gray-600">
          Click a landmark, then click on the X-ray to place it
        </p>
      </div>

      {Object.entries(groupedLandmarks).map(([category, landmarkList]) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>

          <div className="space-y-2">
            {landmarkList.map((landmark) => {
              const isActive = activeLandmarkId === landmark.id;
              const isHovered = hoveredLandmarkId === landmark.id;
              const isPlaced = landmark.position !== null;

              return (
                <button
                  key={landmark.id}
                  onClick={() => handleLandmarkClick(landmark.id)}
                  className={`
                    w-full text-left p-3 rounded-lg border-2 transition-all
                    ${
                      isActive
                        ? "border-blue-500 bg-blue-50"
                        : isPlaced
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }
                    ${isHovered ? "shadow-md" : ""}
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {isPlaced ? (
                        <Check size={20} className="text-green-600" />
                      ) : (
                        <Circle
                          size={20}
                          className={
                            isActive ? "text-blue-500" : "text-gray-400"
                          }
                          fill={landmark.color}
                          fillOpacity={0.3}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block px-2 py-0.5 text-xs font-bold rounded"
                          style={{
                            backgroundColor: landmark.color,
                            color: "white",
                          }}
                        >
                          {landmark.abbreviation}
                        </span>
                        <span className="font-medium text-sm">
                          {landmark.name}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {landmark.description}
                      </p>

                      {isPlaced && (
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          Placed at ({landmark.position!.x.toFixed(0)},{" "}
                          {landmark.position!.y.toFixed(0)})
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Progress indicator */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Progress</span>
          <span className="text-gray-600">
            {Object.values(landmarks).filter((l) => l.position).length} /{" "}
            {Object.values(landmarks).length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{
              width: `${
                (Object.values(landmarks).filter((l) => l.position).length /
                  Object.values(landmarks).length) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
