"use client";

import React from "react";
import { Service } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Cpu, PlayCircle, Eye } from "lucide-react";

interface ProcessListProps {
  serverName: string;
  processes: Service[];
  isServerOnline: boolean;
  selectedProcess: Service | null;
  onSelectProcess: (process: Service) => void;
  onTestProcess: () => void;
}

export const ProcessList: React.FC<ProcessListProps> = ({
  serverName,
  processes,
  isServerOnline,
  selectedProcess,
  onSelectProcess,
  onTestProcess,
}) => {
  if (!isServerOnline) {
    return null;
  }

  if (processes.length === 0) {
    return (
      <div className="text-center py-12">
        <Cpu className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No Processes Found
        </h3>
        <p className="text-sm text-neutral-400">
          No processes configured for this server.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Processes on <span className="text-neutral-400">{serverName}</span>
        </h2>
        <Badge status="online" showDot>
          {processes.length} Configured
        </Badge>
      </div>

      <div className="grid gap-3">
        {processes.map((process) => {
          const isSelected = selectedProcess?.pm2Id === process.pm2Id;

          return (
            <Card
              key={process.pm2Id}
              variant={isSelected ? "selected" : "default"}
              hoverable
              className="overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${isSelected ? "bg-white/20" : "bg-neutral-800"}`}
                    >
                      <Cpu
                        className={`w-4 h-4 ${isSelected ? "text-white" : "text-neutral-400"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {process.pm2Name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-neutral-500 font-mono">
                          ID: {process.pm2Id}
                        </p>
                        <span className="text-xs text-neutral-600">•</span>
                        <p className="text-xs text-neutral-500">
                          {process.tests.length} test
                          {process.tests.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={isSelected ? "primary" : "outline"}
                      size="sm"
                      onClick={() => onSelectProcess(process)}
                      icon={
                        isSelected ? <Eye className="w-4 h-4" /> : undefined
                      }
                    >
                      {isSelected ? "Viewing" : "View Details"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onTestProcess}
                      disabled={!isSelected}
                      icon={<PlayCircle className="w-4 h-4" />}
                    >
                      Run Tests
                    </Button>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-neutral-800 animate-slide-in">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">
                          Test Endpoints:
                        </span>
                        <span className="text-white">
                          {process.tests.length} configured
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {process.tests.map((test, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-neutral-800 rounded text-neutral-300 font-mono"
                            title={test.url}
                          >
                            {test.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
