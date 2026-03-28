"use client";

import React from "react";
import { TestSummary as TestSummaryType } from "@/types";
import { Card } from "./Card";
import { StatsCard } from "./StatsCard";
import { Badge } from "./Badge";
import {
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface TestSummaryProps {
  summary: TestSummaryType;
  serverName: string;
}

export const TestSummaryComponent: React.FC<TestSummaryProps> = ({
  summary,
  serverName,
}) => {
  const successRate = parseFloat(summary.tests.successRate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Test Summary</h2>
        <Badge
          status={
            successRate === 100
              ? "healthy"
              : successRate > 70
                ? "warning"
                : "unhealthy"
          }
        >
          {summary.tests.successRate} Success Rate
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Services Health"
          value={`${summary.services.healthy}/${summary.services.total}`}
          subtitle={`${summary.services.problematic} problematic`}
          icon={<Server className="w-4 h-4" />}
          trend={summary.services.problematic === 0 ? "up" : "down"}
        />
        <StatsCard
          title="Tests Passed"
          value={`${summary.tests.passed}/${summary.tests.total}`}
          subtitle={`${summary.tests.failed} failed`}
          icon={<Activity className="w-4 h-4" />}
          trend={summary.tests.failed === 0 ? "up" : "down"}
        />
        <StatsCard
          title="Timestamp"
          value={new Date(summary.timestamp).toLocaleTimeString()}
          subtitle={new Date(summary.timestamp).toLocaleDateString()}
          icon={<CheckCircle className="w-4 h-4" />}
        />
      </div>

      {summary.problems.length > 0 && (
        <Card variant="error" className="p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-3">Issues Detected</h3>
              <div className="space-y-3">
                {summary.problems.map((problem, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">
                        {problem.service}
                      </span>
                      <span className="text-xs text-red-400">
                        {problem.pm2}
                      </span>
                    </div>
                    {problem.failedEndpoints.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {problem.failedEndpoints.map((endpoint, eidx) => (
                          <span
                            key={eidx}
                            className="px-2 py-1 text-xs bg-red-500/10 rounded text-red-400"
                          >
                            <XCircle className="w-3 h-3 inline mr-1" />
                            {endpoint}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
