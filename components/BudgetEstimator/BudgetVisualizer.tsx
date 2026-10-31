"use client";

import React from "react";
import { CategoryAllocation, Currency } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

interface BudgetVisualizerProps {
  allocations: Record<string, CategoryAllocation>;
  currency: Currency;
  totalBudget: number;
  onNormalize: () => void;
}

export const BudgetVisualizer: React.FC<BudgetVisualizerProps> = ({
  allocations,
  currency,
  totalBudget,
  onNormalize
}) => {
  const categories = Object.values(allocations);
  const totalPercentage = categories.reduce((acc, c) => acc + c.percentage, 0);
  const isExact = totalPercentage === 100;
  const isOver = totalPercentage > 100;

  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Portfolio Allocation Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Visual distribution of {formatCurrency(totalBudget, currency)} across 6 key event pillars.
          </p>
        </div>

        {/* Status Indicator & Quick Auto-Balance */}
        <div className="flex items-center gap-2">
          {isExact ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Balanced
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                isOver 
                  ? 'bg-neon-pink/15 text-neon-pink border-neon-pink/40'
                  : 'bg-neon-purple/15 text-neon-purple border-neon-purple/40'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {totalPercentage}% Allocated ({isOver ? `+${totalPercentage - 100}%` : `${totalPercentage - 100}%`})
              </span>
              <Button variant="outline" size="sm" onClick={onNormalize} className="h-7 text-xs border-neon-cyan/40 hover:border-neon-cyan text-neon-cyan">
                Auto-Balance
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Segment Stacked Progress Bar */}
      <div className="w-full h-4 sm:h-5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shadow-inner">
        {categories.map((cat) => {
          if (cat.percentage <= 0) return null;
          // Scale to fit visually even if sum != 100
          const displayWidth = (cat.percentage / (totalPercentage || 100)) * 100;
          return (
            <div
              key={cat.id}
              className="h-full transition-all duration-300 relative group first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${displayWidth}%`,
                backgroundColor: cat.color
              }}
              title={`${cat.name}: ${cat.percentage}% (${formatCurrency(cat.allocatedAmount, currency)})`}
            />
          );
        })}
      </div>

      {/* Category Legend Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: cat.color }}
            />
            <div className="truncate">
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {cat.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {cat.percentage}% • {formatCurrency(cat.allocatedAmount, currency)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
