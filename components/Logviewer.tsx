"use client";

import { useState } from "react";

interface LogViewerProps {
  out: string[];
  error: string[];
  hasErrors: boolean;
}

export default function LogViewer({ out, error, hasErrors }: LogViewerProps) {
  const [activeTab, setActiveTab] = useState<"out" | "error">("out");

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab("out")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "out"
              ? "bg-gray-800 text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Output Logs ({out.length})
        </button>
        <button
          onClick={() => setActiveTab("error")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "error"
              ? "bg-gray-800 text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-300"
          } ${hasErrors ? "text-red-400" : ""}`}
        >
          Error Logs ({error.length})
        </button>
      </div>

      <div className="p-4 font-mono text-sm overflow-x-auto">
        {activeTab === "out" ? (
          out.length > 0 ? (
            <div className="space-y-1">
              {out.map((line, index) => (
                <div key={index} className="text-green-400">
                  <span className="text-gray-500 mr-2">[{index + 1}]</span>
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No output logs available</p>
          )
        ) : error.length > 0 ? (
          <div className="space-y-1">
            {error.map((line, index) => (
              <div key={index} className="text-red-400">
                <span className="text-gray-500 mr-2">[{index + 1}]</span>
                {line}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No error logs available</p>
        )}
      </div>
    </div>
  );
}
