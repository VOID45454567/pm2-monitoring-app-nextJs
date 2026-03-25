"use client";

import { TestResult } from "@/types";

interface TestResultsProps {
  tests: TestResult[];
}

export default function TestResults({ tests }: TestResultsProps) {
  const getStatusBadge = (passed: boolean) => {
    return passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {tests.map((test, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {test.service.name}
              </h3>
              <p className="text-sm text-gray-500">ID: {test.service.id}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(test.pm2.passed)}`}
              >
                PM2: {test.pm2.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(test.summary.failed === 0)}`}
              >
                {test.summary.passed}/{test.summary.total} Passed
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Endpoint
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Expected
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Actual
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {test.endpoints.map((endpoint, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {endpoint.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {endpoint.method}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {endpoint.expected}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {endpoint.actual}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {endpoint.duration}ms
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(endpoint.passed)}`}
                      >
                        {endpoint.passed ? "PASSED" : "FAILED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Last updated: {new Date(test.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
