"use client";

import React, { useState, useEffect } from "react";
import { Service } from "@/types";
import { useProcessDetails } from "@/hooks/useProcessDetails";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatsCard } from "@/components/ui/StatsCard";
import { Alert } from "@/components/ui/Alert";
import {
  Activity,
  Clock,
  RotateCw,
  HardDrive,
  Terminal,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  formatUptime,
  formatMemory,
  formatPercentage,
} from "@/lib/utils/formatters";

interface ProcessDetailsProps {
  process: Service;
  serverUrl: string;
  serverTimeout?: number;
  onTestsRun: () => void;
}

export const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  process,
  serverUrl,
  serverTimeout,
  onTestsRun,
}) => {
  const [expandedTests, setExpandedTests] = useState(false);
  const [copiedLogType, setCopiedLogType] = useState<"out" | "error" | null>(
    null,
  );

  const {
    stats,
    testResults,
    logs,
    isLoadingStats,
    isLoadingTests,
    isLoadingLogs,
    showLogs,
    loadStats,
    runTests,
    toggleLogs,
    clearData,
  } = useProcessDetails(process, serverUrl, serverTimeout);

  useEffect(() => {
    loadStats();
    return () => clearData();
  }, [process, loadStats, clearData]);

  const copyToClipboard = async (text: string, type: "out" | "error") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLogType(type);
      setTimeout(() => setCopiedLogType(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatLogLine = (
    line: string,
    index: number,
    type: "out" | "error",
  ) => {
    const isErrorLine =
      type === "error" ||
      line.toLowerCase().includes("error") ||
      line.toLowerCase().includes("fail") ||
      line.toLowerCase().includes("exception");

    return (
      <div
        key={index}
        className={`py-1 px-2 font-mono text-xs border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50 transition-colors group ${
          isErrorLine ? "text-yellow-400" : "text-green-400"
        }`}
      >
        <span className="inline-block w-10 text-neutral-600 select-none">
          {index + 1}
        </span>
        <span className="break-all">{line || "(empty line)"}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Process Info Card */}
      <div className="rounded-xl border border-white/20 bg-neutral-900/50 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {process.pm2Name}
              </h3>
              <p className="text-sm text-neutral-400">
                Process ID: {process.pm2Id}
              </p>
            </div>
            {stats && (
              <Badge
                status={stats.status === "online" ? "healthy" : "unhealthy"}
                showDot
              >
                {stats.status}
              </Badge>
            )}
            {isLoadingStats && (
              <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
            )}
          </div>

          {stats && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="CPU Usage"
                value={stats.cpu ? formatPercentage(stats.cpu) : "N/A"}
                icon={<Activity className="w-4 h-4" />}
                trend={
                  stats.cpu > 70 ? "up" : stats.cpu > 50 ? "neutral" : "down"
                }
              />
              <StatsCard
                title="Memory"
                value={stats.memory ? formatMemory(stats.memory) : "N/A"}
                icon={<HardDrive className="w-4 h-4" />}
              />
              <StatsCard
                title="Uptime"
                value={stats.uptime ? formatUptime(stats.uptime) : "N/A"}
                icon={<Clock className="w-4 h-4" />}
              />
              <StatsCard
                title="Restarts"
                value={stats.restart_time || 0}
                icon={<RotateCw className="w-4 h-4" />}
              />
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <Button
              variant="secondary"
              onClick={toggleLogs}
              isLoading={isLoadingLogs && !showLogs}
              icon={<Terminal className="w-4 h-4" />}
            >
              {showLogs ? "Hide Logs" : "View Logs"}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                runTests();
                onTestsRun();
              }}
              isLoading={isLoadingTests}
              icon={<Activity className="w-4 h-4" />}
            >
              Run Tests
            </Button>
          </div>

          {/* Logs Section */}
          {showLogs && (
            <div className="space-y-4">
              {isLoadingLogs ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                </div>
              ) : logs ? (
                <>
                  {logs.out && logs.out.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-400" />
                          <h4 className="text-sm font-semibold text-white">
                            Output Logs
                          </h4>
                          <span className="text-xs text-neutral-500">
                            ({logs.out.length} lines)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(logs.out.join("\n"), "out")
                          }
                          icon={
                            copiedLogType === "out" ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )
                          }
                        />
                      </div>
                      <div className="bg-black/50 rounded-lg border border-neutral-800 overflow-hidden">
                        <div className="max-h-96 overflow-y-auto scrollbar-thin">
                          {logs.out.map((line, idx) =>
                            formatLogLine(line, idx, "out"),
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {logs.error && logs.error.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <h4 className="text-sm font-semibold text-white">
                            Error Logs
                          </h4>
                          <span className="text-xs text-neutral-500">
                            ({logs.error.length} lines)
                          </span>
                          {logs.hasErrors && (
                            <Badge status="unhealthy" showDot={false}>
                              Has Errors
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(logs.error.join("\n"), "error")
                          }
                          icon={
                            copiedLogType === "error" ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )
                          }
                        />
                      </div>
                      <div className="bg-black/50 rounded-lg border border-red-800/30 overflow-hidden">
                        <div className="max-h-96 overflow-y-auto scrollbar-thin">
                          {logs.error.map((line, idx) => (
                            <div
                              key={idx}
                              className="py-1 px-2 font-mono text-xs text-red-400 border-b border-red-800/20 last:border-0 hover:bg-red-950/30 transition-colors"
                            >
                              <span className="inline-block w-10 text-neutral-600 select-none">
                                {idx + 1}
                              </span>
                              <span className="break-all">
                                {line || "(empty line)"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {(!logs.out || logs.out.length === 0) &&
                    (!logs.error || logs.error.length === 0) && (
                      <div className="text-center py-12 text-neutral-500">
                        <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No logs available for this process</p>
                        <p className="text-xs mt-2">
                          Logs will appear here when the process generates
                          output
                        </p>
                      </div>
                    )}

                  {(logs.out?.length > 0 || logs.error?.length > 0) && (
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-500">
                      <div className="flex gap-4">
                        <span>📄 Output: {logs.out?.length || 0} lines</span>
                        <span>⚠️ Errors: {logs.error?.length || 0} lines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span>Normal</span>
                        <div className="w-2 h-2 rounded-full bg-yellow-400 ml-2" />
                        <span>Warnings</span>
                        <div className="w-2 h-2 rounded-full bg-red-400 ml-2" />
                        <span>Errors</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Alert
                  type="error"
                  title="Failed to Load Logs"
                  message="Unable to retrieve logs for this process. Please try again."
                  onRetry={toggleLogs}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Test Results Card */}
      {testResults && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 animate-slide-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-lg font-semibold text-white">Test Results</h3>
              <Badge status={testResults.pm2.passed ? "healthy" : "unhealthy"}>
                {testResults.pm2.passed ? "PM2 Healthy" : "PM2 Unhealthy"}
              </Badge>
            </div>

            {!testResults.pm2.passed && (
              <Alert
                type="error"
                title="PM2 Health Check Failed"
                message={
                  testResults.pm2.message ||
                  `Expected ${testResults.pm2.expected}, got ${testResults.pm2.status}`
                }
              />
            )}

            <div>
              <button
                onClick={() => setExpandedTests(!expandedTests)}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm font-medium text-white">
                    Endpoint Tests ({testResults.summary.passed}/
                    {testResults.summary.total} passed)
                  </span>
                </div>
                {expandedTests ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                )}
              </button>

              {expandedTests && (
                <div className="mt-3 space-y-2">
                  {testResults.endpoints.map((endpoint, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        endpoint.passed
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-red-500/5 border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {endpoint.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="font-medium text-white">
                            {endpoint.name}
                          </span>
                        </div>
                        <Badge
                          status={endpoint.passed ? "healthy" : "unhealthy"}
                          showDot={false}
                        >
                          {endpoint.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-neutral-400 font-mono break-all">
                          {endpoint.url}
                        </p>
                        <p className="text-neutral-500">
                          Status: {endpoint.statusCode} (Expected:{" "}
                          {endpoint.expectedStatusCode})
                        </p>
                        {endpoint.error && (
                          <p className="text-red-400 text-xs mt-2">
                            {endpoint.error}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-800">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Summary:</span>
                <span className="text-white font-medium">
                  {testResults.summary.passed}/{testResults.summary.total} tests
                  passed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
