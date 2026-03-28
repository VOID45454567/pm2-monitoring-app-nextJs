"use client";

import { ServerStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

interface ServerStatusBadgeProps {
  status: ServerStatus;
  onRetry?: () => void;
  isLoading?: boolean;
}

export const ServerStatusBadge: React.FC<ServerStatusBadgeProps> = ({
  status,
  onRetry,
  isLoading = false,
}) => {
  const isOnline = status.reachable;

  return (
    <div className="flex items-center gap-3">
      <Badge status={isOnline ? "online" : "offline"} showDot>
        {isOnline ? "Online" : "Offline"}
      </Badge>

      {!isOnline && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          isLoading={isLoading}
          icon={<RefreshCw className="w-3 h-3" />}
        >
          Retry
        </Button>
      )}

      {status.responseTime && isOnline && (
        <span className="text-xs text-neutral-500">
          {status.responseTime}ms
        </span>
      )}
    </div>
  );
};
