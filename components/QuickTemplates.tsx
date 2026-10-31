"use client";

import React from "react";
import { Sparkles, Heart, Zap, Building } from "lucide-react";
import { Badge } from "./ui/Badge";

interface QuickTemplatesProps {
  currentType: string;
  onSelectTemplate: (type: 'wedding' | 'birthday' | 'corporate' | 'sangeet') => void;
}

export const QuickTemplates: React.FC<QuickTemplatesProps> = ({ currentType, onSelectTemplate }) => {
  return (
    <div className="w-full bg-slate-50/80 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/60 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="luxury" size="sm" className="gap-1">
            <Sparkles className="w-3 h-3" />
            Hackathon Demo Presets
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            One-click pre-populated full blueprints:
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => onSelectTemplate('wedding')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              currentType === 'wedding'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Napa Vineyard Wedding ($42k)</span>
          </button>

          <button
            onClick={() => onSelectTemplate('sangeet')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 bg-slate-900 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/15 hover:shadow-neon-cyan"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan fill-neon-cyan" />
            <span>Royal Sangeet Palace ($60k)</span>
          </button>

          <button
            onClick={() => onSelectTemplate('birthday')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              currentType === 'birthday'
                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
            <span>Neon 30th Rooftop ($11k)</span>
          </button>

          <button
            onClick={() => onSelectTemplate('corporate')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              currentType === 'corporate'
                ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-blue-500" />
            <span>Tech Horizon Summit ($75k)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
