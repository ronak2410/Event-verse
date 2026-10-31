"use client";

import React from "react";
import { Sparkles, Gamepad2, Users, Clock, Tag } from "lucide-react";
import { ActivityIdea } from "@/lib/types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface ActivitiesListProps {
  activities: ActivityIdea[];
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({ activities }) => {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4 text-purple-500" />
          Interactive Experiences & Icebreakers
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Engaging concepts and games designed to elevate guest connection and avoid awkward pauses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {activities.map((act) => (
          <div
            key={act.id}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {act.timeframe}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {act.targetGroup}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                {act.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
              {act.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
