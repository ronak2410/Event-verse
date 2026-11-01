"use client";

import React from "react";
import { 
  Building2, 
  Utensils, 
  Sparkles, 
  Music, 
  Camera, 
  ShieldAlert, 
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { CategoryAllocation, Currency } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface BudgetSliderProps {
  category: CategoryAllocation;
  currency: Currency;
  totalBudget: number;
  onChangePercentage: (newPct: number) => void;
}

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  category,
  currency,
  totalBudget,
  onChangePercentage
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2": return <Building2 className="w-4 h-4" />;
      case "Utensils": return <Utensils className="w-4 h-4" />;
      case "Sparkles": return <Sparkles className="w-4 h-4" />;
      case "Music": return <Music className="w-4 h-4" />;
      case "Camera": return <Camera className="w-4 h-4" />;
      default: return <ShieldAlert className="w-4 h-4" />;
    }
  };

  const isOverSpent = category.spentAmount > category.allocatedAmount;
  const spentPercent = category.allocatedAmount > 0 
    ? Math.round((category.spentAmount / category.allocatedAmount) * 100)
    : 0;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
            style={{ 
              backgroundColor: `${category.color}15`, 
              color: category.color,
              borderColor: `${category.color}30` 
            }}
          >
            {getIcon(category.iconName)}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {category.name}
              {category.aiSuggestedPercentage && category.aiSuggestedPercentage !== category.percentage && (
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40">
                  AI Suggests {category.aiSuggestedPercentage}%
                </span>
              )}
            </h4>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Committed: <span className={isOverSpent ? "text-neon-pink font-semibold" : "text-slate-700 dark:text-slate-300 font-medium"}>
                {formatCurrency(category.spentAmount, currency)}
              </span> ({spentPercent}%)
            </div>
          </div>
        </div>

        {/* Current Allocation Value */}
        <div className="text-right">
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(category.allocatedAmount, currency)}
          </div>
          <div className="text-xs font-semibold text-neon-cyan">
            {category.percentage}%
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span>0%</span>
          <span>50%</span>
        </div>
        <input
          type="range"
          role="slider"
          aria-label={`${category.name} budget allocation percentage`}
          aria-valuemin={1}
          aria-valuemax={60}
          aria-valuenow={category.percentage}
          aria-valuetext={`${category.percentage}% (${formatCurrency(category.allocatedAmount, currency)})`}
          min="1"
          max="60"
          step="1"
          value={category.percentage}
          onChange={(e) => onChangePercentage(Number(e.target.value))}
          className="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-cyan rounded-full"
          style={{
            accentColor: category.color
          }}
        />
      </div>

      {/* Mini spent progress bar */}
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOverSpent ? "bg-rose-500" : "bg-slate-400 dark:bg-slate-600"
          }`}
          style={{ width: `${Math.min(spentPercent, 100)}%` }}
        />
      </div>

      {/* Rationale or warning */}
      {isOverSpent ? (
        <div className="mt-2 text-xs text-rose-500 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Over allocated budget by {formatCurrency(category.spentAmount - category.allocatedAmount, currency)}</span>
        </div>
      ) : category.rationale ? (
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
          &ldquo;{category.rationale}&rdquo;
        </p>
      ) : null}
    </div>
  );
};
