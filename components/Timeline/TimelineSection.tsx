"use client";

import React, { useState } from "react";
import { Clock, Calendar, CheckSquare, Sparkles, Printer } from "lucide-react";
import { MilestoneCountdown } from "./MilestoneCountdown";
import { DayOfRunOfShow } from "./DayOfRunOfShow";
import { StaffLiveMode } from "./StaffLiveMode";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { EventVerseState, BudgetCategoryKey, DayOfScheduleItem } from "@/lib/types";

interface TimelineSectionProps {
  state: EventVerseState;
  onToggleMilestoneTask: (milestoneId: string, taskId: string) => void;
  onAddMilestoneTask: (milestoneId: string, title: string, category: BudgetCategoryKey | 'general') => void;
  onToggleDayOfItem: (id: string) => void;
  onAddDayOfItem: (item: Omit<DayOfScheduleItem, 'id' | 'completed'>) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  state,
  onToggleMilestoneTask,
  onAddMilestoneTask,
  onToggleDayOfItem,
  onAddDayOfItem
}) => {
  const [subTab, setSubTab] = useState<'milestones' | 'runofshow' | 'stafflive'>('milestones');

  const totalTasks = state.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = state.milestones.reduce((acc, m) => acc + m.tasks.filter((t) => t.completed).length, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-cyan-950/60 border border-purple-500/30 shadow-card-3d flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm" className="gap-1">
              <Calendar className="w-3 h-3 text-purple-400" />
              Timeline & Schedule Architecture
            </Badge>
            <span className="text-xs text-slate-400">
              High-precision planning timetable
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Countdown & Master Run-of-Show
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Target Event Date: <strong className="text-white">{state.event.date || 'TBD'}</strong> • Progress: <strong className="text-cyan-400 font-mono font-bold">{completedTasks} of {totalTasks} milestones ready</strong>
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSubTab('milestones')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'milestones'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-purple-300" />
            <span>Milestone Countdown</span>
          </button>

          <button
            onClick={() => setSubTab('runofshow')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'runofshow'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Day-of Timetable ({state.dayOfSchedule.length})</span>
          </button>

          <button
            onClick={() => setSubTab('stafflive')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'stafflive'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-neon-pink'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>⚡ Staff Live Mode</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {subTab === 'milestones' && (
        <MilestoneCountdown
          milestones={state.milestones}
          onToggleTask={onToggleMilestoneTask}
          onAddTask={onAddMilestoneTask}
        />
      )}

      {subTab === 'runofshow' && (
        <DayOfRunOfShow
          schedule={state.dayOfSchedule}
          onToggleItem={onToggleDayOfItem}
          onAddItem={onAddDayOfItem}
        />
      )}

      {subTab === 'stafflive' && (
        <StaffLiveMode
          schedule={state.dayOfSchedule}
          onToggleItem={onToggleDayOfItem}
          onExitLiveMode={() => setSubTab('runofshow')}
        />
      )}
    </div>
  );
};
