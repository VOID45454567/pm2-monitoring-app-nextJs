"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/api/index";
import { ProcessDetails } from "@/types";
import LogViewer from "@/components/Logviewer";

export default function ProcessDetailsPage() {
  const params = useParams();
  const processName = params.name as string;

  const [details, setDetails] = useState<ProcessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState(30);

  useEffect(() => {
    fetchDetails();
  }, [processName, lines]);

  const fetchDetails = async () => {
    try {
      const data = await api.getProcessDetails(processName, lines);
      setDetails(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch process details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || "Process not found"}
      </div>
    );
  }

  const process = details.process[0];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{process.name}</h1>
            <p className="text-gray-500">
              PID: {process.pid} | ID: {process.id}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              process.status === "online"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {process.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">CPU Usage</p>
            <p className="text-2xl font-bold">{process.cpu}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Memory Usage</p>
            <p className="text-2xl font-bold">
              {(process.memory / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Uptime</p>
            <p className="text-2xl font-bold">
              {Math.floor((Date.now() - process.uptime) / (1000 * 60 * 60))}h{" "}
              {Math.floor(
                ((Date.now() - process.uptime) % (1000 * 60 * 60)) /
                  (1000 * 60),
              )}
              m
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Logs</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Lines:</label>
            <select
              value={lines}
              onChange={(e) => setLines(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <LogViewer
          out={details.out}
          error={details.error}
          hasErrors={details.hasErrors}
        />
      </div>
    </div>
  );
}
