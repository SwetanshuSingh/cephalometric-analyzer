"use client";

import { useState } from "react";
import { Ruler, CheckCircle, AlertCircle } from "lucide-react";
import { useCephStore } from "@/store/use-store";
import { Point } from "@/types/landmarks";

const CalibrationPanel = () => {
  const { imageScale, isCalibrated, setImageScale } = useCephStore();

  const [calibrationMode, setCalibrationMode] = useState(false);
  const [point1, setPoint1] = useState<Point | null>(null);
  const [point2, setPoint2] = useState<Point | null>(null);
  const [knownDistance, setKnownDistance] = useState<string>("10");

  const handleStartCalibration = () => {
    setCalibrationMode(true);
    setPoint1(null);
    setPoint2(null);
  };

  const handleCalculateScale = () => {
    if (!point1 || !point2 || !knownDistance) return;

    const pixelDistance = Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );

    const mmDistance = parseFloat(knownDistance);

    if (isNaN(mmDistance) || mmDistance <= 0) {
      alert("Please enter a valid distance");
      return;
    }

    const scale = pixelDistance / mmDistance;
    setImageScale(scale);
    setCalibrationMode(false);

    alert(
      `Calibration successful!\nScale: ${scale.toFixed(
        2
      )} pixels per mm\n${pixelDistance.toFixed(0)} pixels = ${mmDistance} mm`
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <Ruler size={20} className="text-blue-500" />
        <h3 className="font-semibold">Image Calibration</h3>
        {isCalibrated && <CheckCircle size={16} className="text-green-500" />}
      </div>

      {!isCalibrated && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
          <AlertCircle
            size={16}
            className="text-yellow-600 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-yellow-800">
            Calibration required for accurate measurements. Please calibrate
            using a known distance on the X-ray (e.g., ruler marks).
          </p>
        </div>
      )}

      {isCalibrated && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800 font-medium">
            ✓ Calibrated: {imageScale.toFixed(2)} pixels/mm
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Known Distance (mm)
          </label>
          <input
            type="number"
            value={knownDistance}
            onChange={(e) => setKnownDistance(e.target.value)}
            placeholder="e.g., 10"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            min="0"
            step="0.1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the real-world distance of a known measurement on the X-ray
          </p>
        </div>

        {!calibrationMode ? (
          <button
            onClick={handleStartCalibration}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {isCalibrated ? "Re-calibrate" : "Start Calibration"}
          </button>
        ) : (
          <>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-medium mb-2">Calibration Steps:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Click the start point of a known distance on the X-ray</li>
                <li>Click the end point of that same distance</li>
                <li>Click "Calculate Scale" below</li>
              </ol>

              {point1 && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ Point 1 placed at ({point1.x.toFixed(0)},{" "}
                  {point1.y.toFixed(0)})
                </p>
              )}
              {point2 && (
                <p className="text-xs text-green-600">
                  ✓ Point 2 placed at ({point2.x.toFixed(0)},{" "}
                  {point2.y.toFixed(0)})
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCalculateScale}
                disabled={!point1 || !point2}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Calculate Scale
              </button>
              <button
                onClick={() => {
                  setCalibrationMode(false);
                  setPoint1(null);
                  setPoint2(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Manual scale input */}
        <div className="pt-4 border-t">
          <label className="block text-sm font-medium mb-2">
            Or Enter Scale Manually
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="pixels per mm"
              className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              step="0.01"
            />
            <button
              onClick={() => {
                const input = document.querySelector(
                  'input[placeholder="pixels per mm"]'
                ) as HTMLInputElement;
                const value = parseFloat(input.value);
                if (value > 0) {
                  setImageScale(value);
                }
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalibrationPanel;
