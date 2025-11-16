"use client";

import { useState, useEffect } from "react";
import { Ruler, CheckCircle, AlertCircle } from "lucide-react";
import { useCephStore } from "@/store/use-store";
import { Point } from "@/types/landmarks";
import { calculateDistance } from "@/utils/calculations";

const CalibrationPanel = () => {
  const { imageScale, isCalibrated, setImageScale } = useCephStore();

  const [calibrationMode, setCalibrationMode] = useState(false);
  const [point1, setPoint1] = useState<Point | null>(null);
  const [point2, setPoint2] = useState<Point | null>(null);
  const [knownDistance, setKnownDistance] = useState<string>("10");
  const [pixelDistance, setPixelDistance] = useState<number | null>(null);

  // Reset points when entering calibration mode
  useEffect(() => {
    if (calibrationMode) {
      setPoint1(null);
      setPoint2(null);
      setPixelDistance(null);
    }
  }, [calibrationMode]);

  // Calculate pixel distance when both points are set
  useEffect(() => {
    if (point1 && point2) {
      const distance = calculateDistance(point1, point2);
      setPixelDistance(distance);
    }
  }, [point1, point2]);

  const handleStartCalibration = () => {
    setCalibrationMode(true);
    // Set the calibration mode in the store
    useCephStore.getState().setCalibrationMode(true);
  };

  const handleCancelCalibration = () => {
    setCalibrationMode(false);
    setPoint1(null);
    setPoint2(null);
    setPixelDistance(null);
    useCephStore.getState().setCalibrationMode(false);
  };

  const handleCalculateScale = () => {
    if (!point1 || !point2 || !knownDistance || !pixelDistance) return;

    const mmDistance = parseFloat(knownDistance);

    if (isNaN(mmDistance) || mmDistance <= 0) {
      alert("Please enter a valid distance in millimeters");
      return;
    }

    const scale = pixelDistance / mmDistance;
    setImageScale(scale);
    setCalibrationMode(false);
    useCephStore.getState().setCalibrationMode(false);

    alert(
      `✓ Calibration Successful!\n\n` +
        `Scale: ${scale.toFixed(3)} pixels per mm\n` +
        `Measured: ${pixelDistance.toFixed(1)} pixels = ${mmDistance} mm\n\n` +
        `You can now place landmarks and get accurate measurements.`
    );
  };

  const handleSetManualScale = () => {
    const input = document.getElementById(
      "manual-scale-input"
    ) as HTMLInputElement;
    const value = parseFloat(input.value);

    if (value > 0) {
      setImageScale(value);
      alert(`Manual scale set: ${value.toFixed(3)} pixels per mm`);
    } else {
      alert("Please enter a valid scale value");
    }
  };

  // Listen for calibration clicks from canvas
  useEffect(() => {
    if (!calibrationMode) return;

    const handleCalibrationClick = (event: CustomEvent<Point>) => {
      const point = event.detail;

      if (!point1) {
        setPoint1(point);
      } else if (!point2) {
        setPoint2(point);
      }
    };

    window.addEventListener(
      "calibration-click" as any,
      handleCalibrationClick as any
    );

    return () => {
      window.removeEventListener(
        "calibration-click" as any,
        handleCalibrationClick as any
      );
    };
  }, [calibrationMode, point1, point2]);

  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Ruler size={20} className="text-blue-500" />
        <h3 className="font-semibold text-lg">Image Calibration</h3>
        {isCalibrated && <CheckCircle size={18} className="text-green-500" />}
      </div>

      {/* Status Alert */}
      {!isCalibrated && !calibrationMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-2">
          <AlertCircle
            size={18}
            className="text-yellow-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-sm text-yellow-800 font-medium">
              Calibration Required
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Calibrate the image using a known distance for accurate
              measurements.
            </p>
          </div>
        </div>
      )}

      {isCalibrated && !calibrationMode && (
        <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-sm text-green-800 font-medium flex items-center gap-2">
            <CheckCircle size={16} />
            Calibrated Successfully
          </p>
          <p className="text-xs text-green-700 mt-1">
            Scale: <strong>{imageScale.toFixed(3)}</strong> pixels per mm
          </p>
        </div>
      )}

      {/* Calibration Instructions */}
      {calibrationMode && (
        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            📍 Calibration Mode Active
          </p>
          <ol className="text-sm space-y-2 list-decimal list-inside text-blue-800">
            <li>Look for a ruler or scale on your X-ray</li>
            <li>
              Click the <strong>start point</strong> of a known distance
            </li>
            <li>
              Click the <strong>end point</strong> of that same distance
            </li>
            <li>Verify the distance below and click &quot;Calculate&quot;</li>
          </ol>

          <div className="mt-3 space-y-2">
            {point1 && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-700 font-medium">
                  Point 1: ({point1.x.toFixed(0)}, {point1.y.toFixed(0)})
                </span>
              </div>
            )}
            {point2 && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-blue-700 font-medium">
                  Point 2: ({point2.x.toFixed(0)}, {point2.y.toFixed(0)})
                </span>
              </div>
            )}
            {pixelDistance && (
              <div className="p-2 bg-white rounded border border-blue-200 text-xs">
                <span className="text-gray-600">Measured distance: </span>
                <strong className="text-blue-700">
                  {pixelDistance.toFixed(1)} pixels
                </strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Known Distance Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Known Distance (mm)
          </label>
          <input
            type="number"
            value={knownDistance}
            onChange={(e) => setKnownDistance(e.target.value)}
            placeholder="e.g., 10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            min="0"
            step="0.1"
            disabled={calibrationMode}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the real-world distance in millimeters
          </p>
        </div>

        {/* Common Distances Helper */}
        {!calibrationMode && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Common Reference Distances:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setKnownDistance("10")}
                className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-left"
              >
                📏 Ruler: 10mm
              </button>
              <button
                onClick={() => setKnownDistance("50")}
                className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-left"
              >
                📏 Ruler: 50mm
              </button>
              <button
                onClick={() => setKnownDistance("20")}
                className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-left"
              >
                🦴 Condyle: ~20mm
              </button>
              <button
                onClick={() => setKnownDistance("65")}
                className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-left"
              >
                👁️ Pupil: ~65mm
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!calibrationMode ? (
          <button
            onClick={handleStartCalibration}
            className="w-full px-4 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 active:bg-blue-700 transition shadow-sm"
          >
            {isCalibrated ? "🔄 Re-calibrate Image" : "▶️ Start Calibration"}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCalculateScale}
              disabled={!point1 || !point2}
              className="flex-1 px-4 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 active:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
            >
              ✓ Calculate Scale
            </button>
            <button
              onClick={handleCancelCalibration}
              className="px-4 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 active:bg-gray-600 transition shadow-sm"
            >
              ✕ Cancel
            </button>
          </div>
        )}

        {/* Manual Scale Input */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Or Set Scale Manually
          </label>
          <div className="flex gap-2">
            <input
              id="manual-scale-input"
              type="number"
              placeholder="pixels per mm"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              step="0.001"
              min="0"
            />
            <button
              onClick={handleSetManualScale}
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 active:bg-gray-800 transition shadow-sm"
            >
              Set
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            If you already know the scale factor
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalibrationPanel;
