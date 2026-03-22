"use client";

import { useEffect, useState } from "react";
import { api } from "@/api/index";
import { Process } from "@/types";
import ProcessCard from "@/components/ProcessCard";

export default function Home() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProcesses();
    const interval = setInterval(fetchProcesses, 5000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchProcesses = async () => {
    try {
      const data = await api.getProcesses();
      if (data.status === "ok") {
        console.log(data);

        setProcesses(data.processes);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch processes");
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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">PM2 Processes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processes.map((process) => (
          <ProcessCard key={process.id} process={process} />
        ))}
      </div>
    </div>
  );
}
