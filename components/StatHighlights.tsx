"use client";

import React from "react";
import { DollarSign, Users, Calendar, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { EventVerseState } from "@/lib/types";
import { formatCurrency, calculatePerGuest, getBenchmarkInsight } from "@/lib/utils";

interface StatHighlightsProps {
  state: EventVerseState;
}

export const StatHighlights: React.FC<StatHighlightsProps> = ({ state }) => {
  const { event, budgetAllocations, dayOfSchedule, milestones } = state;

  const totalSpent = Object.values(budgetAllocations).reduce((acc, c) => acc + c.spentAmount, 0);
  const remaining = event.totalBudget - totalSpent;
  const percentSpent = event.totalBudget > 0 ? Math.round((totalSpent / event.totalBudget) * 100) : 0;

  const totalTasks = milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const benchmark = getBenchmarkInsight(event.type, event.guestCount, event.totalBudget);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Total Budget & Per Guest */}
      <Card className="p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Budget
          </span>
          <div className="p-2 rounded-xl bg-neon-cyan/15 text-neon-cyan">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {formatCurrency(event.totalBudget, event.currency)}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-neon-cyan">
            {calculatePerGuest(event.totalBudget, event.guestCount, event.currency)}
          </span>
        </div>
      </Card>

      {/* 2. Committed Spend & Health */}
      <Card className="p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Committed / Spent
          </span>
          <div className={`p-2 rounded-xl ${remaining >= 0 ? 'bg-neon-emerald/15 text-neon-emerald' : 'bg-neon-pink/15 text-neon-pink'}`}>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {formatCurrency(totalSpent, event.currency)}
        </div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className={remaining >= 0 ? "text-slate-500 dark:text-slate-400" : "text-neon-pink font-semibold"}>
            {remaining >= 0 ? `${formatCurrency(remaining, event.currency)} buffer left` : `Over by ${formatCurrency(Math.abs(remaining), event.currency)}`}
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {percentSpent}%
          </span>
        </div>
        {/* Mini progress bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${percentSpent > 100 ? 'bg-neon-pink' : percentSpent > 85 ? 'bg-neon-purple' : 'bg-neon-emerald'}`}
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          />
        </div>
      </Card>

      {/* 3. Guest Count & Tier */}
      <Card className="p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Guest Count & Tier
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {event.guestCount} Guests
        </div>
        <div className="mt-1">
          <Badge variant="secondary" size="sm" className="text-[10px] truncate max-w-full">
            {benchmark.tier}
          </Badge>
        </div>
      </Card>

      {/* 4. Planning Readiness Milestone Progress */}
      <Card className="p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Milestones Ready
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {completedTasks} / {totalTasks} Tasks
        </div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span>{taskProgress}% Complete</span>
          <span>{dayOfSchedule.length} Day-of Events</span>
        </div>
        {/* Mini progress bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${taskProgress}%` }}
          />
        </div>
      </Card>
    </div>
  );
};
