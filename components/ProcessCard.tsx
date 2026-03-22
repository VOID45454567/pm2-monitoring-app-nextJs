"use client";

import { Process } from "@/types";
import Link from "next/link";

interface ProcessCardProps {
  process: Process;
}

export default function ProcessCard({ process }: ProcessCardProps) {
  const formatMemory = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const formatUptime = (timestamp: number) => {
    const uptime = Date.now() - timestamp;
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {process.name}
          </h3>
          <p className="text-sm text-gray-500">PID: {process.pid}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(process.status)}`}
        >
          {process.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">CPU</p>
          <p className="text-lg font-semibold">{process.cpu}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Memory</p>
          <p className="text-lg font-semibold">
            {formatMemory(process.memory)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Uptime</p>
          <p className="text-lg font-semibold">
            {formatUptime(process.uptime)}
          </p>
        </div>
      </div>

      <Link
        href={`/processes/${process.name}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        View Details
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}
