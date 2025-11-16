"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { useCephStore } from "@/store/use-store";
import { validateMeasurement } from "@/utils/calculations";

const MeasurementsPanel = () => {
  const {
    linearMeasurements,
    angularMeasurements,
    selectedAnalysis,
    isCalibrated,
    setSelectedAnalysis,
  } = useCephStore();

  const getStatusIcon = (
    value: number | null,
    range: { min: number; max: number }
  ) => {
    if (value === null) return null;

    const status = validateMeasurement(value, range);

    switch (status) {
      case "low":
        return <TrendingDown size={16} className="text-blue-500" />;
      case "high":
        return <TrendingUp size={16} className="text-red-500" />;
      case "normal":
        return <Minus size={16} className="text-green-500" />;
    }
  };

  const getStatusColor = (
    value: number | null,
    range: { min: number; max: number }
  ) => {
    if (value === null) return "text-gray-400";

    const status = validateMeasurement(value, range);

    switch (status) {
      case "low":
        return "text-blue-600";
      case "high":
        return "text-red-600";
      case "normal":
        return "text-green-600";
    }
  };

  const getStatusText = (
    value: number | null,
    range: { min: number; max: number }
  ) => {
    if (value === null) return "Not calculated";

    const status = validateMeasurement(value, range);

    switch (status) {
      case "low":
        return "Below normal";
      case "high":
        return "Above normal";
      case "normal":
        return "Normal";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-white">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Measurements</h2>

        {/* Analysis selector */}
        <div className="flex gap-2 mb-4">
          {["steiner", "downs", "mcnamara"].map((analysis) => (
            <button
              key={analysis}
              onClick={() => setSelectedAnalysis(analysis as any)}
              className={`
                px-4 py-2 rounded text-sm font-medium transition
                ${
                  selectedAnalysis === analysis
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {analysis.charAt(0).toUpperCase() + analysis.slice(1)}
            </button>
          ))}
        </div>

        {!isCalibrated && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
            <AlertTriangle
              size={16}
              className="text-yellow-600 mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-yellow-800">
              Please calibrate the image for accurate measurements
            </p>
          </div>
        )}
      </div>

      {/* Angular Measurements */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Angular Measurements</h3>

        {angularMeasurements.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Place landmarks to see measurements
          </p>
        ) : (
          <div className="space-y-3">
            {angularMeasurements.map((measurement) => (
              <div
                key={measurement.id}
                className="p-4 border rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{measurement.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {measurement.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {getStatusIcon(measurement.value, measurement.normalRange)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Value</p>
                    <p
                      className={`font-bold ${getStatusColor(
                        measurement.value,
                        measurement.normalRange
                      )}`}
                    >
                      {measurement.value !== null
                        ? `${measurement.value.toFixed(1)}°`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Normal Range</p>
                    <p className="font-medium text-gray-700">
                      {measurement.normalRange.min}° -{" "}
                      {measurement.normalRange.max}°
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p
                      className={`font-medium ${getStatusColor(
                        measurement.value,
                        measurement.normalRange
                      )}`}
                    >
                      {getStatusText(
                        measurement.value,
                        measurement.normalRange
                      )}
                    </p>
                  </div>
                </div>

                {measurement.value !== null && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <p className="font-medium mb-1">Interpretation:</p>
                    <p className="text-gray-700">
                      {
                        measurement.interpretation[
                          validateMeasurement(
                            measurement.value,
                            measurement.normalRange
                          )
                        ]
                      }
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Linear Measurements */}
      {linearMeasurements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Linear Measurements</h3>

          <div className="space-y-3">
            {linearMeasurements.map((measurement) => (
              <div
                key={measurement.id}
                className="p-4 border rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{measurement.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {measurement.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {getStatusIcon(measurement.value, measurement.normalRange)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Value</p>
                    <p
                      className={`font-bold ${getStatusColor(
                        measurement.value,
                        measurement.normalRange
                      )}`}
                    >
                      {measurement.value !== null
                        ? `${measurement.value.toFixed(1)} mm`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Normal Range</p>
                    <p className="font-medium text-gray-700">
                      {measurement.normalRange.min} -{" "}
                      {measurement.normalRange.max} mm
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p
                      className={`font-medium ${getStatusColor(
                        measurement.value,
                        measurement.normalRange
                      )}`}
                    >
                      {getStatusText(
                        measurement.value,
                        measurement.normalRange
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementsPanel;
