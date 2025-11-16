"use client";

import { useMemo } from "react";
import { FileDown, Printer, Share2 } from "lucide-react";
import { useCephStore } from "@/store/use-store";
import { getSkeletalClass, validateMeasurement } from "@/utils/calculations";

const ResultsPanel = () => {
  const { angularMeasurements, linearMeasurements, selectedAnalysis } =
    useCephStore();

  // Generate diagnosis based on measurements
  const diagnosis = useMemo(() => {
    const sna = angularMeasurements.find((m) => m.id === "sna");
    const snb = angularMeasurements.find((m) => m.id === "snb");
    const anb = angularMeasurements.find((m) => m.id === "anb");

    if (!sna?.value || !snb?.value || !anb?.value) {
      return null;
    }

    const findings: string[] = [];

    // Skeletal classification
    const skeletalClass = getSkeletalClass(anb.value);

    // Maxillary position
    const snaStatus = validateMeasurement(sna.value, sna.normalRange);
    if (snaStatus === "low") {
      findings.push(
        "Maxillary retrognathism (upper jaw positioned posteriorly)"
      );
    } else if (snaStatus === "high") {
      findings.push("Maxillary prognathism (upper jaw positioned anteriorly)");
    }

    // Mandibular position
    const snbStatus = validateMeasurement(snb.value, snb.normalRange);
    if (snbStatus === "low") {
      findings.push(
        "Mandibular retrognathism (lower jaw positioned posteriorly)"
      );
    } else if (snbStatus === "high") {
      findings.push("Mandibular prognathism (lower jaw positioned anteriorly)");
    }

    // Growth pattern
    const gonialAngle = angularMeasurements.find(
      (m) => m.id === "gonial-angle"
    );
    if (gonialAngle?.value) {
      const gonialStatus = validateMeasurement(
        gonialAngle.value,
        gonialAngle.normalRange
      );
      if (gonialStatus === "low") {
        findings.push(
          "Horizontal growth pattern with reduced lower facial height"
        );
      } else if (gonialStatus === "high") {
        findings.push(
          "Vertical growth pattern with increased lower facial height"
        );
      }
    }

    // Dental findings
    const u1sn = angularMeasurements.find((m) => m.id === "upper-incisor-sn");
    if (u1sn?.value) {
      const u1Status = validateMeasurement(u1sn.value, u1sn.normalRange);
      if (u1Status === "low") {
        findings.push("Retroclined upper incisors");
      } else if (u1Status === "high") {
        findings.push("Proclined upper incisors");
      }
    }

    return {
      skeletalClass,
      snaValue: sna.value,
      snbValue: snb.value,
      anbValue: anb.value,
      findings:
        findings.length > 0
          ? findings
          : ["Normal skeletal and dental relationships"],
    };
  }, [angularMeasurements]);

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("PDF export functionality coming soon!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert("Share functionality coming soon!");
  };

  if (!diagnosis) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">No Results Yet</p>
          <p className="text-sm">
            Place landmarks and complete measurements to see analysis results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-white">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Analysis Results</h2>
        <p className="text-sm text-gray-600">
          {selectedAnalysis.charAt(0).toUpperCase() + selectedAnalysis.slice(1)}{" "}
          Analysis
        </p>
      </div>

      {/* Skeletal Classification */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Skeletal Classification</h3>
        <p className="text-2xl font-bold text-blue-700 mb-4">
          {diagnosis.skeletalClass}
        </p>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">SNA</p>
            <p className="font-bold">{diagnosis.snaValue.toFixed(1)}°</p>
          </div>
          <div>
            <p className="text-gray-600">SNB</p>
            <p className="font-bold">{diagnosis.snbValue.toFixed(1)}°</p>
          </div>
          <div>
            <p className="text-gray-600">ANB</p>
            <p className="font-bold">{diagnosis.anbValue.toFixed(1)}°</p>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Key Findings</h3>
        <ul className="space-y-2">
          {diagnosis.findings.map((finding, index) => (
            <li
              key={index}
              className="flex items-start gap-2 p-3 bg-gray-50 rounded border"
            >
              <span className="text-blue-500 font-bold">•</span>
              <span className="text-sm">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary Statistics */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Measurement Summary</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-gray-600 mb-1">Normal</p>
            <p className="text-2xl font-bold text-green-700">
              {
                [...angularMeasurements, ...linearMeasurements].filter(
                  (m) =>
                    m.value !== null &&
                    validateMeasurement(m.value, m.normalRange) === "normal"
                ).length
              }
            </p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-gray-600 mb-1">Abnormal</p>
            <p className="text-2xl font-bold text-yellow-700">
              {
                [...angularMeasurements, ...linearMeasurements].filter(
                  (m) =>
                    m.value !== null &&
                    validateMeasurement(m.value, m.normalRange) !== "normal"
                ).length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleExportPDF}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <FileDown size={20} />
          Export as PDF
        </button>

        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          <Printer size={20} />
          Print Report
        </button>

        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <Share2 size={20} />
          Share Results
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-xs text-gray-700">
        <p className="font-semibold mb-1">⚠️ Medical Disclaimer</p>
        <p>
          This analysis is for educational and reference purposes only. It
          should not replace professional clinical judgment. Always consult with
          a qualified orthodontist or dentist for diagnosis and treatment
          planning.
        </p>
      </div>
    </div>
  );
};

export default ResultsPanel;
