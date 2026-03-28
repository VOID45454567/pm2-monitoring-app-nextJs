"use client";

import React from "react";
import { AlertCircle, X, RefreshCw, CheckCircle, Info } from "lucide-react";
import { Button } from "./Button";

interface AlertProps {
  type: "warning" | "error" | "info" | "success";
  title: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onRetry,
  onDismiss,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return "border-l-yellow-500 bg-yellow-500/10";
      case "error":
        return "border-l-red-500 bg-red-500/10";
      case "success":
        return "border-l-green-500 bg-green-500/10";
      case "info":
        return "border-l-white bg-neutral-900";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "info":
        return <Info className="w-5 h-5 text-white" />;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-400";
      case "info":
        return "text-white";
    }
  };

  return (
    <div
      className={`border-l-4 rounded-r-lg p-4 ${getTypeStyles()} animate-slide-in`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {getIcon()}
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${getTextColor()}`}>{title}</h4>
            <p className="text-sm text-neutral-400">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="p-1.5"
              icon={<RefreshCw className="w-4 h-4" />}
            />
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="p-1.5"
              icon={<X className="w-4 h-4" />}
            />
          )}
        </div>
      </div>
    </div>
  );
};
