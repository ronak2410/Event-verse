"use client";

import React, { useState } from "react";
import { Sparkles, DollarSign, Users, RefreshCw, Compass, ArrowRight, Lightbulb } from "lucide-react";
import { BudgetVisualizer } from "./BudgetVisualizer";
import { BudgetSlider } from "./BudgetSlider";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { EventVerseState, BudgetCategoryKey, EventDetails } from "@/lib/types";
import { formatCurrency, calculatePerGuest, getBenchmarkInsight } from "@/lib/utils";

interface BudgetSectionProps {
  state: EventVerseState;
  onUpdatePercentage: (category: BudgetCategoryKey, newPct: number) => void;
  onNormalize: () => void;
  onApplyAIRebalance: (priority: EventDetails['priorityFocus']) => void;
  onUpdateTotalBudget: (newBudget: number) => void;
  isAiLoading: boolean;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  state,
  onUpdatePercentage,
  onNormalize,
  onApplyAIRebalance,
  onUpdateTotalBudget,
  isAiLoading
}) => {
  const { event, budgetAllocations } = state;
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetValue, setBudgetValue] = useState(event.totalBudget.toString());

  const handleSaveBudget = () => {
    const num = parseFloat(budgetValue);
    if (!isNaN(num) && num > 0) {
      onUpdateTotalBudget(num);
    }
    setEditingBudget(false);
  };

  const benchmark = getBenchmarkInsight(event.type, event.guestCount, event.totalBudget);

  const priorities: Array<{ id: EventDetails['priorityFocus']; label: string; desc: string }> = [
    { id: 'balanced', label: 'AI Balanced', desc: 'Standard industry benchmarks' },
    { id: 'food_first', label: 'Culinary Focus', desc: '38% Catering + Artisanal Bar' },
    { id: 'atmosphere', label: 'Atmosphere First', desc: '20% Decor + Ambient Lighting' },
    { id: 'entertainment', label: 'High Energy', desc: '18% DJ, Live Bands & AV' },
    { id: 'memories', label: 'Documentary Focus', desc: '17% Photo & Cinema Video' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Quick Budget Adjuster & AI Reallocation Strategy */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-neon-cyan/15 via-neon-purple/10 to-transparent border border-neon-cyan/30 flex flex-col md:flex-row md:items-center justify-between gap-4 card-3d shadow-neon-cyan">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="luxury" size="sm" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Dynamic Budget Estimator
            </Badge>
            <span className="text-xs text-slate-400">
              Interactive allocation engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {event.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-300">
            <span>Overall: <strong className="text-white">{formatCurrency(event.totalBudget, event.currency)}</strong></span>
            <span>•</span>
            <span>Guests: <strong className="text-white">{event.guestCount}</strong></span>
            <span>•</span>
            <span>Per Guest: <strong className="text-neon-cyan">{calculatePerGuest(event.totalBudget, event.guestCount, event.currency)}</strong></span>
          </div>
        </div>

        {/* Quick Edit Budget Amount */}
        <div className="flex items-center gap-2">
          {editingBudget ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                className="w-32 px-3 py-1.5 rounded-xl border border-neon-cyan/50 bg-slate-900 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-neon-cyan"
              />
              <Button size="sm" variant="luxury" onClick={handleSaveBudget}>
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBudgetValue(event.totalBudget.toString());
                setEditingBudget(true);
              }}
              className="gap-1 text-xs border-neon-cyan/40 hover:border-neon-cyan text-neon-cyan"
            >
              <DollarSign className="w-3.5 h-3.5 text-neon-cyan" />
              Edit Total Budget
            </Button>
          )}
        </div>
      </div>

      {/* Visualizer Stacked Bar */}
      <BudgetVisualizer
        allocations={budgetAllocations}
        currency={event.currency}
        totalBudget={event.totalBudget}
        onNormalize={onNormalize}
      />

      {/* AI Reallocation Suggestions Selector */}
      <Card className="p-4 sm:p-5 card-3d">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-neon-purple" />
              AI One-Click Strategic Reallocation
            </h3>
            <p className="text-xs text-slate-400">
              Select an event focus to automatically shift category weightings based on guest satisfaction models.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {priorities.map((p) => {
            const isCurrent = event.priorityFocus === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onApplyAIRebalance(p.id)}
                disabled={isAiLoading}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isCurrent
                    ? 'border-neon-cyan bg-neon-cyan/15 text-white shadow-neon-cyan ring-2 ring-neon-cyan/40'
                    : 'border-slate-800 hover:border-neon-purple/50 bg-slate-900/90 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{p.label}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 6 Category Sliders Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Category Allocations & Sliders
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Drag sliders to fine-tune your celebration budget
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(budgetAllocations).map((cat) => (
            <BudgetSlider
              key={cat.id}
              category={cat}
              currency={event.currency}
              totalBudget={event.totalBudget}
              onChangePercentage={(newPct) => onUpdatePercentage(cat.id, newPct)}
            />
          ))}
        </div>
      </div>

      {/* Benchmark Insight Card */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-neon-cyan/15 text-neon-cyan shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <div className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
            Industry Benchmark Insight ({benchmark.tier})
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {benchmark.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
