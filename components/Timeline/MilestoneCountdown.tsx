"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar, 
  Tag,
  Sparkles
} from "lucide-react";
import { TimelineMilestone, BudgetCategoryKey } from "@/lib/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface MilestoneCountdownProps {
  milestones: TimelineMilestone[];
  onToggleTask: (milestoneId: string, taskId: string) => void;
  onAddTask: (milestoneId: string, title: string, category: BudgetCategoryKey | 'general') => void;
}

export const MilestoneCountdown: React.FC<MilestoneCountdownProps> = ({
  milestones,
  onToggleTask,
  onAddTask
}) => {
  const [activeAddingMilestoneId, setActiveAddingMilestoneId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleCreateTask = (milestoneId: string) => {
    if (!newTaskTitle.trim()) return;
    onAddTask(milestoneId, newTaskTitle.trim(), "general");
    setNewTaskTitle("");
    setActiveAddingMilestoneId(null);
  };

  return (
    <div className="space-y-6">
      {milestones.map((milestone, idx) => {
        const total = milestone.tasks.length;
        const completed = milestone.tasks.filter((t) => t.completed).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <Card key={milestone.id} className="overflow-hidden">
            {/* Phase Header */}
            <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon-purple/20 text-neon-purple font-bold text-xs flex items-center justify-center border border-neon-purple/50 shadow-neon-purple">
                  #{idx + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {milestone.phase}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>{milestone.timeframe}</span>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300">
                  {completed}/{total} Completed ({progress}%)
                </span>
                <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="p-4 sm:p-5 divide-y divide-slate-800/60">
              {milestone.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(milestone.id, task.id)}
                  className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 cursor-pointer group hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                >
                  <button
                    type="button"
                    aria-label={`Toggle completion for ${task.title}`}
                    className="mt-0.5 text-slate-400 group-hover:text-neon-cyan transition-colors shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-neon-emerald fill-neon-emerald/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <span
                      className={`text-sm font-medium transition-all ${
                        task.completed
                          ? "line-through text-slate-500"
                          : "text-slate-200"
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.category && task.category !== "general" && (
                      <span className="ml-2 inline-flex items-center text-[10px] font-medium px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 capitalize">
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Custom Task Form */}
              <div className="pt-3">
                {activeAddingMilestoneId === milestone.id ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Add custom task (e.g., Book vintage car get-away)..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateTask(milestone.id)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
                    />
                    <Button size="sm" variant="luxury" onClick={() => handleCreateTask(milestone.id)} className="h-8 text-xs">
                      Add
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setActiveAddingMilestoneId(null)} className="h-8 text-xs">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAddingMilestoneId(milestone.id);
                      setNewTaskTitle("");
                    }}
                    className="flex items-center gap-1.5 text-xs text-neon-cyan hover:text-white font-semibold transition-colors py-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task to {milestone.phase}</span>
                  </button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
