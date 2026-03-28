"use client";

import React from "react";
import { Circle } from "lucide-react";
import { STATUS_COLORS } from "@/lib/utils/constants";

interface BadgeProps {
  status: "online" | "offline" | "healthy" | "unhealthy" | "warning";
  showDot?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  showDot = true,
  children,
  className = "",
}) => {
  const statusText = {
    online: "Online",
    offline: "Offline",
    healthy: "Healthy",
    unhealthy: "Unhealthy",
    warning: "Warning",
  };

  const dotColors = {
    online: "text-green-400",
    offline: "text-red-400",
    healthy: "text-green-400",
    unhealthy: "text-red-400",
    warning: "text-yellow-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[status]} ${className}`}
    >
      {showDot && (
        <Circle className={`w-2 h-2 fill-current ${dotColors[status]}`} />
      )}
      {children || statusText[status]}
    </span>
  );
};
