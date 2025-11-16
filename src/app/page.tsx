"use client";

import CalibrationPanel from "@/components/calibration-panel";
import CephCanvas from "@/components/ceph-canvas";
import ImageUploader from "@/components/image-uploader";
import LandmarkPanel from "@/components/landmark-panel";
import MeasurementsPanel from "@/components/measurements-panel";
import ResultsPanel from "@/components/results-panel";
import { useCephStore } from "@/store/use-store";
import {
  RotateCcw,
  Eye,
  EyeOff,
  Grid3x3,
  Save,
  Undo,
  Redo,
} from "lucide-react";
import { useState } from "react";

const Home = () => {
  const {
    uploadedImage,
    showLandmarkLabels,
    showMeasurementLines,
    showGrid,
    toggleLandmarkLabels,
    toggleMeasurementLines,
    toggleGrid,
    reset,
    undo,
    redo,
    history,
    historyIndex,
  } = useCephStore();

  const [activeTab, setActiveTab] = useState<
    "landmarks" | "measurements" | "results"
  >("landmarks");

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all landmarks? This cannot be undone."
      )
    ) {
      reset();
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Cephalometric Analyzer
              </h1>
              <p className="text-sm text-gray-600">
                Professional cephalometric analysis tool
              </p>
            </div>

            {/* Toolbar */}
            {uploadedImage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo size={20} />
                </button>

                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo size={20} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <button
                  onClick={toggleLandmarkLabels}
                  className={`p-2 rounded hover:bg-gray-100 ${
                    showLandmarkLabels ? "bg-blue-100 text-blue-600" : ""
                  }`}
                  title="Toggle landmark labels"
                >
                  {showLandmarkLabels ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>

                <button
                  onClick={toggleMeasurementLines}
                  className={`p-2 rounded hover:bg-gray-100 ${
                    showMeasurementLines ? "bg-blue-100 text-blue-600" : ""
                  }`}
                  title="Toggle measurement lines"
                >
                  <Grid3x3 size={20} />
                </button>

                <button
                  onClick={toggleGrid}
                  className={`p-2 rounded hover:bg-gray-100 ${
                    showGrid ? "bg-blue-100 text-blue-600" : ""
                  }`}
                  title="Toggle grid"
                >
                  <Grid3x3 size={20} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  title="Reset all landmarks"
                >
                  <RotateCcw size={20} />
                  <span className="text-sm font-medium">Reset</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("landmarks")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === "landmarks"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Landmarks
            </button>
            <button
              onClick={() => setActiveTab("measurements")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === "measurements"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Measurements
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === "results"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Results
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "landmarks" && <LandmarkPanel />}
            {activeTab === "measurements" && <MeasurementsPanel />}
            {activeTab === "results" && <ResultsPanel />}
          </div>
        </aside>

        {/* Center - Canvas Area */}
        <main className="flex-1 flex flex-col">
          {!uploadedImage ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-2xl w-full">
                <ImageUploader />

                {/* Instructions */}
                {/* <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">How to Use</h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <span>
                        Upload a lateral cephalometric X-ray image (JPG, PNG, or
                        BMP format)
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <span>
                        Calibrate the image using a known distance (e.g., ruler
                        marks on the X-ray)
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <span>
                        Select landmarks from the left panel and click on the
                        X-ray to place them
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                        4
                      </span>
                      <span>
                        View measurements and analysis results in the respective
                        tabs
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                        5
                      </span>
                      <span>
                        Export your analysis as a PDF report for documentation
                      </span>
                    </li>
                  </ol>
                </div> */}

                {/* Features */}
                {/* <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-sm mb-1">Accurate</h4>
                    <p className="text-xs text-gray-600">
                      Precise measurements with calibration
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-semibold text-sm mb-1">
                      Multiple Analyses
                    </h4>
                    <p className="text-xs text-gray-600">
                      Steiner, Downs, McNamara
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <h4 className="font-semibold text-sm mb-1">
                      Export Reports
                    </h4>
                    <p className="text-xs text-gray-600">
                      PDF and print options
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          ) : (
            <CephCanvas />
          )}
        </main>

        {/* Right Sidebar - Calibration */}
        {uploadedImage && (
          <aside className="w-80 bg-white border-l p-4 overflow-y-auto">
            <CalibrationPanel />

            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Landmarks Placed:</span>
                  <span className="font-medium">
                    {
                      Object.values(useCephStore.getState().landmarks).filter(
                        (l) => l.position
                      ).length
                    }{" "}
                    / {Object.keys(useCephStore.getState().landmarks).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Measurements:</span>
                  <span className="font-medium">
                    {useCephStore.getState().angularMeasurements.length +
                      useCephStore.getState().linearMeasurements.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Calibrated:</span>
                  <span
                    className={`font-medium ${
                      useCephStore.getState().isCalibrated
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {useCephStore.getState().isCalibrated ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Keyboard Shortcuts</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Undo:</span>
                  <kbd className="px-2 py-1 bg-white rounded border">
                    Ctrl+Z
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Redo:</span>
                  <kbd className="px-2 py-1 bg-white rounded border">
                    Ctrl+Y
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zoom In:</span>
                  <kbd className="px-2 py-1 bg-white rounded border">
                    Scroll Up
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zoom Out:</span>
                  <kbd className="px-2 py-1 bg-white rounded border">
                    Scroll Down
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pan:</span>
                  <kbd className="px-2 py-1 bg-white rounded border">
                    Click + Drag
                  </kbd>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Cephalometric Analyzer v1.0 - For educational and reference purposes
            only
          </p>
          <p>Made with React + TypeScript + Konva.js</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
