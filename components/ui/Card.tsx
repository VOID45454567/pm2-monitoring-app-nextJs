"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "selected" | "error" | "success";
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className = "",
  onClick,
  hoverable = true,
}) => {
  const variants = {
    default: "bg-neutral-900/50 border-neutral-800",
    selected: "bg-neutral-900 border-white shadow-lg shadow-white/5",
    error: "bg-red-950/20 border-red-800",
    success: "bg-green-950/20 border-green-800",
  };

  const hoverStyles = hoverable
    ? "hover:border-neutral-700 transition-all duration-300"
    : "";

  return (
    <div
      className={`rounded-xl border ${variants[variant]} ${hoverStyles} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
