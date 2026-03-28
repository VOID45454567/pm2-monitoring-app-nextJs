"use client";

import React from "react";
import { Server, ServerStatus } from "@/types";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Server as ServerIcon, Wifi, WifiOff, RefreshCw } from "lucide-react";

interface ServerListProps {
  servers: Server[];
  serverStatuses: Map<string, ServerStatus>;
  selectedServer: string | null;
  testingServer: string | null;
  onSelectServer: (serverName: string) => void;
  onTestServer: (serverName: string) => void;
  onRetryConnection: (serverName: string) => void;
}

export const ServerList: React.FC<ServerListProps> = ({
  servers,
  serverStatuses,
  selectedServer,
  testingServer,
  onSelectServer,
  onTestServer,
  onRetryConnection,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Servers</h2>
        <div className="text-xs text-neutral-500">
          {servers.filter((s) => serverStatuses.get(s.name)?.reachable).length}/
          {servers.length} Online
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server) => {
          const status = serverStatuses.get(server.name);
          const isSelected = selectedServer === server.name;
          const isTesting = testingServer === server.name;
          const isOnline = status?.reachable || false;

          return (
            <Card
              key={server.name}
              variant={isSelected ? "selected" : "default"}
              className="group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isOnline ? "bg-white/10" : "bg-neutral-800"}`}
                    >
                      <ServerIcon
                        className={`w-5 h-5 ${isOnline ? "text-white" : "text-neutral-500"}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {server.name}
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono">
                        {server.url}
                      </p>
                    </div>
                  </div>
                  <Badge status={isOnline ? "online" : "offline"} showDot>
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant={isSelected ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => onSelectServer(server.name)}
                      disabled={!isOnline}
                      fullWidth
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTestServer(server.name)}
                      isLoading={isTesting}
                      fullWidth
                    >
                      Test
                    </Button>
                  </div>

                  {!isOnline && status?.error && (
                    <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <WifiOff className="w-3 h-3 text-red-400" />
                          <span className="text-xs text-red-400">
                            {status.error}
                          </span>
                        </div>
                        <button
                          onClick={() => onRetryConnection(server.name)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  )}

                  {isOnline && (
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <Wifi className="w-3 h-3" />
                      <span>Connected</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
