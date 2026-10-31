"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "luxury" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none";

    const variants = {
      default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 focus:ring-slate-400 shadow-sm",
      luxury: "bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 hover:from-cyan-300 hover:via-sky-300 hover:to-purple-400 text-slate-950 font-bold shadow-md shadow-cyan-500/35 hover:shadow-cyan-400/55 focus:ring-cyan-400 border border-cyan-300/60 active:scale-[0.97]",
      secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-cyan-400 border border-slate-700",
      outline: "border border-cyan-500/40 bg-slate-900/60 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 focus:ring-cyan-400",
      ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/80 focus:ring-cyan-400",
      destructive: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-400 shadow-sm"
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2 gap-2 h-10",
      lg: "text-base px-6 py-2.5 gap-2.5 h-12",
      icon: "h-10 w-10 p-0"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
