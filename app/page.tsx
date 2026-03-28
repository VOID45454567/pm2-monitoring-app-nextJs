"use client";

import { useEffect } from "react";
import { ServerCard } from "@/components/server/ServerCard";
import { useServerStore } from "@/stores/useServerStore";

export default function Home() {
  const { servers, serverStatuses, loadServers } = useServerStore();

  console.log(servers);

  // Только загружаем серверы, без глобальной проверки
  useEffect(() => {
    console.log("[App] Loading servers...");
    loadServers();
  }, [loadServers]);

  if (servers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-neutral-800 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-neutral-400">Loading servers...</p>
        </div>
      </div>
    );
  }

  const onlineCount = servers.filter(
    (s) => serverStatuses.get(s.name)?.reachable,
  ).length;
  const offlineCount = servers.length - onlineCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 border-b border-neutral-800 pb-6">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
          PM2 Monitor
        </h1>
        <p className="text-neutral-500 mt-3 text-lg">
          Real-time monitoring and testing dashboard for PM2 processes
        </p>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>{onlineCount} Online</span>
          </div>
          <div className="w-px h-4 bg-neutral-800" />
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>{offlineCount} Offline</span>
          </div>
          <div className="w-px h-4 bg-neutral-800" />
          <span className="text-sm text-neutral-600">
            {servers.length} server{servers.length !== 1 ? "s" : ""} configured
          </span>
          <div className="ml-4 text-xs text-neutral-600">
            Each server checks independently based on its timeout
          </div>
        </div>
      </div>

      {/* Servers Grid - каждый сервер управляет своей проверкой */}
      <div className="space-y-4">
        {servers.map((server, index) => (
          <ServerCard
            key={server.name}
            server={server}
            isExpanded={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
