"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverEffect = true, children, ...props }) => {
  return (
    <div
      className={cn(
        "card-3d rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-900/90 shadow-card-3d backdrop-blur-xl overflow-hidden transition-all duration-300",
        hoverEffect && "hover:border-cyan-500/40 hover:shadow-card-3d-hover hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-5 border-b border-slate-100 dark:border-slate-800/60", className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100", className)} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn("text-xs text-slate-500 dark:text-slate-400 mt-1", className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-5", className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-5 pt-0 flex items-center", className)} {...props} />
);
