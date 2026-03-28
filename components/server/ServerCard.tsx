"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Server } from "@/types";
import { useServerStore } from "@/stores/useServerStore";
import { useServerChecker } from "@/hooks/useServerChecker";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProcessList } from "@/components/process/ProcessList";
import { ProcessDetails } from "@/components/process/ProcessDetails";
import {
  ChevronDown,
  ChevronUp,
  Server as ServerIcon,
  Wifi,
  WifiOff,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatResponseTime, formatTimestamp } from "@/lib/utils/formatters";

interface ServerCardProps {
  server: Server;
  isExpanded?: boolean;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  isExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const testInProgressRef = useRef(false);

  const {
    selectedProcess,
    selectProcess,
    loadProcessStats,
    runProcessTests,
    getServerStatus,
  } = useServerStore();

  // Используем хук для проверки сервера
  const { status, isChecking, lastResponseTime, checkConnection } =
    useServerChecker(server);

  // Получаем интервал для отображения
  const checkInterval = server.requestTimeout || 10000;

  const isOnline = status?.reachable === true; // Явная проверка на true
  const error = status?.error;

  const handleProcessSelect = useCallback(
    async (process: any) => {
      selectProcess(process);
      if (isOnline) {
        await loadProcessStats(server.name, process.pm2Name);
      }
    },
    [isOnline, server.name, selectProcess, loadProcessStats],
  );

  const handleTestProcess = useCallback(async () => {
    if (testInProgressRef.current) return;
    if (selectedProcess && isOnline) {
      testInProgressRef.current = true;
      try {
        await runProcessTests(server.name, selectedProcess.pm2Id);
      } finally {
        setTimeout(() => {
          testInProgressRef.current = false;
        }, 1000);
      }
    }
  }, [selectedProcess, isOnline, server.name, runProcessTests]);

  const handleRetry = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // console.log(`[ServerCard ${server.name}] Manual retry clicked`);
      checkConnection();
    },
    [checkConnection, server.name],
  );

  const handleToggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const getIntervalText = () => {
    const seconds = checkInterval / 1000;
    return `every ${seconds} second${seconds !== 1 ? "s" : ""}`;
  };

  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30 transition-all duration-300">
      <div
        className="p-5 cursor-pointer hover:bg-neutral-800/50 transition-colors"
        onClick={handleToggleExpand}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`p-2 rounded-lg ${isOnline ? "bg-white/10" : "bg-neutral-800"}`}
            >
              <ServerIcon
                className={`w-5 h-5 ${isOnline ? "text-white" : "text-neutral-500"}`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-semibold text-white text-lg">
                  {server.name}
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  {server.url}
                </p>
                <span className="text-xs text-neutral-600 font-mono px-2 py-0.5 bg-neutral-800 rounded">
                  check: {getIntervalText()}
                </span>
                {server.requestTimeout && (
                  <span className="text-xs text-neutral-600 font-mono px-2 py-0.5 bg-neutral-800 rounded">
                    timeout: {server.requestTimeout}ms
                  </span>
                )}
              </div>
              {isOnline && server.services.length > 0 && (
                <p className="text-xs text-neutral-500 mt-1">
                  {server.services.length} process
                  {server.services.length !== 1 ? "es" : ""} configured
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isChecking ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                <span className="text-xs text-neutral-400">Checking...</span>
              </div>
            ) : (
              <Badge status={isOnline ? "online" : "offline"} showDot>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            )}

            <button className="text-neutral-400 hover:text-white transition-colors">
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Status Details */}
        <div className="mt-3 space-y-2">
          {!isOnline && !isChecking && error && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-red-400">
                <WifiOff className="w-3 h-3" />
                <span className="truncate">{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                icon={<RefreshCw className="w-3 h-3" />}
              >
                Retry
              </Button>
            </div>
          )}

          {isOnline && (
            <div className="flex items-center gap-2 text-xs text-green-400">
              <Wifi className="w-3 h-3" />
              <span>Connected</span>
              {lastResponseTime && (
                <span className="flex items-center gap-1 text-neutral-500">
                  <Clock className="w-3 h-3" />
                  {formatResponseTime(lastResponseTime)}
                </span>
              )}
            </div>
          )}

          {status && (
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <AlertCircle className="w-3 h-3" />
              <span>
                Last check: {formatTimestamp(status.lastCheck)}
                {!isChecking && ` (${getIntervalText()})`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && isOnline && (
        <div className="border-t border-neutral-800 p-5 space-y-6 animate-slide-in">
          <ProcessList
            serverName={server.name}
            processes={server.services}
            isServerOnline={isOnline}
            selectedProcess={selectedProcess}
            onSelectProcess={handleProcessSelect}
            onTestProcess={handleTestProcess}
          />

          {selectedProcess && (
            <ProcessDetails
              process={selectedProcess}
              serverUrl={server.url}
              serverTimeout={server.requestTimeout}
              onTestsRun={handleTestProcess}
            />
          )}
        </div>
      )}

      {expanded && !isOnline && (
        <div className="border-t border-neutral-800 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 mb-2">Unable to connect to server</p>
          <p className="text-sm text-neutral-500 mb-4">
            {error || "Please check if the server is running and accessible"}
          </p>
          <Button
            variant="primary"
            onClick={handleRetry}
            isLoading={isChecking}
          >
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
};
