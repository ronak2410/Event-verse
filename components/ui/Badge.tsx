"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "purple" | "luxury" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full border transition-colors";

  const variants = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    secondary: "bg-blue-950/60 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-500/20",
    success: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20",
    warning: "bg-violet-950/60 text-violet-300 border-violet-500/40 shadow-sm shadow-violet-500/20",
    purple: "bg-purple-950/60 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20",
    luxury: "bg-gradient-to-r from-cyan-500/15 via-sky-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/20 font-semibold",
    outline: "border-slate-700 text-slate-300 bg-slate-900/40"
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5"
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
