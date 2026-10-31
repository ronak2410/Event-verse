"use client";

import React, { useState } from "react";
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  User, 
  Plus, 
  FileText,
  AlertCircle
} from "lucide-react";
import { DayOfScheduleItem } from "@/lib/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

interface DayOfRunOfShowProps {
  schedule: DayOfScheduleItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<DayOfScheduleItem, 'id' | 'completed'>) => void;
}

export const DayOfRunOfShow: React.FC<DayOfRunOfShowProps> = ({
  schedule,
  onToggleItem,
  onAddItem
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    time: "02:00 PM",
    durationMinutes: 45,
    title: "",
    category: "Program",
    leadPerson: "Day-of Coordinator",
    notes: ""
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;
    onAddItem(newItem);
    setNewItem({
      time: "02:00 PM",
      durationMinutes: 45,
      title: "",
      category: "Program",
      leadPerson: "Day-of Coordinator",
      notes: ""
    });
    setIsAddModalOpen(false);
  };

  const completedCount = schedule.filter((s) => s.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50">
        <div>
          <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Day-of Event Run-of-Show Timetable
          </h3>
          <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 mt-0.5">
            Synchronized master timeline for planners, caterers, sound techs, and coordinators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" size="md">
            {completedCount} / {schedule.length} Events Checked
          </Badge>
          <Button
            size="sm"
            variant="luxury"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Event Slot
          </Button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="relative group transition-all"
          >
            {/* Dot Indicator on vertical rail */}
            <button
              onClick={() => onToggleItem(item.id)}
              className={`absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors z-10 ${
                item.completed
                  ? "bg-neon-emerald text-slate-950 shadow-neon-emerald"
                  : "bg-slate-900 border-2 border-slate-700 text-slate-400 hover:border-neon-cyan hover:text-neon-cyan"
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Event Card */}
            <div
              className={`p-4 rounded-2xl border transition-all card-3d ${
                item.completed
                  ? "border-slate-800 bg-slate-900/40 opacity-70"
                  : "border-slate-800 bg-slate-900 hover:border-neon-cyan/50 shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-neon-cyan font-mono">
                    {item.time}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({item.durationMinutes} min)
                  </span>
                  <Badge variant="outline" size="sm" className="capitalize text-[10px]">
                    {item.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.leadPerson}</span>
                </div>
              </div>

              <h4
                className={`text-base font-semibold mt-1.5 ${
                  item.completed
                    ? "line-through text-slate-400 dark:text-slate-500"
                    : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {item.title}
              </h4>

              {item.notes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                  <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                  <span>{item.notes}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Run-of-Show Event Slot"
        description="Schedule a specific day-of milestone with assigned lead person."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 05:30 PM"
                value={newItem.time}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono outline-none focus:ring-2 focus:ring-neon-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="360"
                value={newItem.durationMinutes}
                onChange={(e) => setNewItem({ ...newItem, durationMinutes: Number(e.target.value) || 15 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sparkler Send-off & Grand Farewell"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Ceremony, Logistics, Dining"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lead Person / Role
              </label>
              <input
                type="text"
                placeholder="e.g. DJ or Maitre D'"
                value={newItem.leadPerson}
                onChange={(e) => setNewItem({ ...newItem, leadPerson: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Execution Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Ensure sound tech has the exit track queued up."
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="luxury" size="sm">
              Add to Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
