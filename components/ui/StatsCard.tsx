"use client";

import React from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
}) => {
  const getTrendIcon = () => {
    if (trend === "up")
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === "down")
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Activity className="w-4 h-4 text-neutral-400" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-400";
    if (trend === "down") return "text-red-400";
    return "text-neutral-400";
  };

  return (
    <div className="bg-neutral-900/30 rounded-xl border border-neutral-800 p-5 hover:border-neutral-700 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-400 mb-2">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {icon && <div className="text-neutral-500">{icon}</div>}
          {trend && getTrendIcon()}
        </div>
      </div>
    </div>
  );
};
