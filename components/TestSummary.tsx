"use client";

import { TestSummary as TestSummaryType } from "@/types";

interface TestSummaryProps {
  summary: TestSummaryType;
}

export default function TestSummary({ summary }: TestSummaryProps) {
  const getSuccessRateColor = (rate: string) => {
    const value = parseFloat(rate);
    if (value >= 80) return "text-green-600";
    if (value >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Test Summary</h2>
        <p className="text-sm text-gray-500">
          {new Date(summary.timestamp).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Services Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Services:</span>
              <span className="font-semibold">{summary.services.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Healthy:</span>
              <span className="text-green-600 font-semibold">
                {summary.services.healthy}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Problematic:</span>
              <span className="text-red-600 font-semibold">
                {summary.services.problematic}
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Tests Results</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tests:</span>
              <span className="font-semibold">{summary.tests.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Passed:</span>
              <span className="text-green-600 font-semibold">
                {summary.tests.passed}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Failed:</span>
              <span className="text-red-600 font-semibold">
                {summary.tests.failed}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span
                className={`font-semibold ${getSuccessRateColor(summary.tests.successRate)}`}
              >
                {summary.tests.successRate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {summary.problems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-600">
            Problems Detected
          </h3>
          <div className="space-y-4">
            {summary.problems.map((problem, idx) => (
              <div
                key={idx}
                className="border border-red-200 rounded-lg p-4 bg-red-50"
              >
                <h4 className="font-semibold text-red-800 mb-2">
                  {problem.service}
                </h4>
                <p className="text-sm text-red-700 mb-2">{problem.pm2}</p>
                {problem.failedEndpoints.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      Failed endpoints:
                    </p>
                    <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                      {problem.failedEndpoints.map((endpoint, i) => (
                        <li key={i}>{endpoint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
