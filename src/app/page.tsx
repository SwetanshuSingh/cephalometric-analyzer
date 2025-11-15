"use client";

import CephCanvas from "@/components/ceph-canvas";
import ImageUploader from "@/components/image-uploader";
import { useCephStore } from "@/store/use-store";

const Home = () => {
  const { uploadedImage } = useCephStore();

  return (
    <main className="flex-1 flex flex-col">
      {!uploadedImage ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full">
            <ImageUploader />

            {/* Instructions */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">How to Use</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>
                    Upload a lateral cephalometric X-ray image (JPG, PNG, or BMP
                    format)
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
                    Select landmarks from the left panel and click on the X-ray
                    to place them
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
            </div>

            {/* Features */}
            <div className="mt-6 grid grid-cols-3 gap-4">
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
                <h4 className="font-semibold text-sm mb-1">Export Reports</h4>
                <p className="text-xs text-gray-600">PDF and print options</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CephCanvas />
      )}
    </main>
  );
};

export default Home;
