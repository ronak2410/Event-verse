"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, Circle, AlertCircle, Sparkles, User, ArrowRight } from "lucide-react";
import { DayOfScheduleItem } from "@/lib/types";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface StaffLiveModeProps {
  schedule: DayOfScheduleItem[];
  onToggleItem: (id: string) => void;
  onExitLiveMode: () => void;
}

export const StaffLiveMode: React.FC<StaffLiveModeProps> = ({
  schedule,
  onToggleItem,
  onExitLiveMode
}) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = schedule.length;
  const completed = schedule.filter((s) => s.completed).length;
  const nextPending = schedule.find((s) => !s.completed);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Live Operational HUD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-purple-950/80 border-2 border-cyan-400/50 shadow-neon-cyan flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
              Staff Live Command Center • Active
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-wider">
            {currentTime || "12:00:00 PM"}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Operational Progress: <strong className="text-cyan-400">{completed} of {total} Milestones Checked</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onExitLiveMode} className="text-xs">
            Exit Live Mode
          </Button>
        </div>
      </div>

      {/* Next Up Alert Banner */}
      {nextPending && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 to-slate-900 border border-purple-500/50 shadow-neon-purple flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-400/40 shrink-0">
              NEXT
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-purple-400 tracking-wider">
                Immediate Action Item • {nextPending.time}
              </span>
              <h4 className="text-base font-bold text-white">{nextPending.title}</h4>
              <p className="text-xs text-slate-300">Lead: <strong>{nextPending.leadPerson}</strong> • {nextPending.notes || "Ready on standby"}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="luxury"
            onClick={() => onToggleItem(nextPending.id)}
            className="shrink-0 text-xs gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Complete</span>
          </Button>
        </div>
      )}

      {/* Large Touch Checklist */}
      <div className="space-y-3">
        {schedule.map((item) => (
          <div
            key={item.id}
            role="checkbox"
            tabIndex={0}
            aria-checked={item.completed}
            aria-label={`${item.time} ${item.title}`}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onToggleItem(item.id); }}
            onClick={() => onToggleItem(item.id)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
              item.completed
                ? "bg-slate-950/40 border-slate-800 opacity-60 line-through"
                : "bg-slate-900/90 border-slate-700/80 hover:border-cyan-400/60 shadow-card-3d hover:shadow-card-3d-hover"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  item.completed
                    ? "bg-emerald-500 text-slate-950 shadow-neon-emerald"
                    : "border-2 border-slate-600 text-slate-400"
                }`}
              >
                {item.completed ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : <Circle className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold text-sm">{item.time}</span>
                  <span className="text-xs text-slate-500">({item.durationMinutes}m)</span>
                  <Badge variant="outline" size="sm" className="text-[10px]">{item.category}</Badge>
                </div>
                <h4 className={`text-base font-bold mt-0.5 ${item.completed ? 'text-slate-500' : 'text-white'}`}>
                  {item.title}
                </h4>
                {item.notes && <p className="text-xs text-slate-400 mt-0.5 italic">{item.notes}</p>}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-slate-300 block">{item.leadPerson}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full mt-1 inline-block ${
                item.completed ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {item.completed ? 'COMPLETED' : 'PENDING'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
