"use client";

import React, { useState, useMemo } from "react";
import { Users, Plus, Utensils, ShieldCheck, Heart, Sparkles, Trash2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { EventVerseState, SeatingGuest, TableLayout } from "@/lib/types";

type Guest = SeatingGuest;

interface SeatingSectionProps {
  state?: EventVerseState;
  tables?: TableLayout[];
  onAddGuest?: (tableId: string, guest: { name: string; dietary: SeatingGuest['dietary'] }) => void;
  onRemoveGuest?: (tableId: string, guestId: string) => void;
}

export const SeatingSection: React.FC<SeatingSectionProps> = ({ 
  state,
  tables: propsTables,
  onAddGuest,
  onRemoveGuest
}) => {
  const [localTables, setLocalTables] = useState<TableLayout[]>([
    {
      id: "tbl-1",
      number: 1,
      name: "VIP Head Table",
      capacity: 8,
      guests: [
        { id: "g-1", name: "Honorees / Couple", dietary: "Regular" },
        { id: "g-2", name: "Guest of Honor", dietary: "Gluten-Free" },
        { id: "g-3", name: "Maid of Honor / Best Friend", dietary: "Vegan" },
        { id: "g-4", name: "Lead Partner / Co-Host", dietary: "Regular" }
      ]
    },
    {
      id: "tbl-2",
      number: 2,
      name: "Family & Elders Circle",
      capacity: 10,
      guests: [
        { id: "g-5", name: "Elders & Grandparents", dietary: "Vegetarian" },
        { id: "g-6", name: "Aunt Maya", dietary: "Jain" },
        { id: "g-7", name: "Uncle David", dietary: "Regular" },
        { id: "g-8", name: "Cousin Nina", dietary: "Vegan" }
      ]
    },
    {
      id: "tbl-3",
      number: 3,
      name: "Tech Visionaries & Keynotes",
      capacity: 8,
      guests: [
        { id: "g-9", name: "Keynote Speaker (Dr. Elena)", dietary: "Halal" },
        { id: "g-10", name: "Lead Systems Architect", dietary: "Regular" },
        { id: "g-11", name: "Design Director", dietary: "Gluten-Free" }
      ]
    },
    {
      id: "tbl-4",
      number: 4,
      name: "College Friends & Dancers",
      capacity: 10,
      guests: [
        { id: "g-12", name: "Alex K.", dietary: "Regular" },
        { id: "g-13", name: "Samira R.", dietary: "Vegetarian" },
        { id: "g-14", name: "Marcus B.", dietary: "Regular" },
        { id: "g-15", name: "Chloe T.", dietary: "Vegan" }
      ]
    }
  ]);

  // Use centralized state tables when provided, otherwise fall back to local state
  const tables = (state?.tables && state.tables.length > 0) 
    ? state.tables 
    : (propsTables && propsTables.length > 0) 
      ? propsTables 
      : localTables;

  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || "tbl-1");
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestDietary, setNewGuestDietary] = useState<SeatingGuest['dietary']>("Regular");
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  // Memoized guest and dietary calculations for optimal rendering efficiency
  const allGuests = useMemo(() => tables.flatMap((t) => t.guests), [tables]);
  const dietaryCounts = useMemo(() => {
    return allGuests.reduce((acc, g) => {
      acc[g.dietary] = (acc[g.dietary] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allGuests]);

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const trimmedName = newGuestName.trim();
    if (onAddGuest) {
      onAddGuest(selectedTableId, {
        name: trimmedName,
        dietary: newGuestDietary
      });
    } else {
      setLocalTables((prev) =>
        prev.map((t) => {
          if (t.id !== selectedTableId) return t;
          if (t.guests.length >= t.capacity) return t;
          return {
            ...t,
            guests: [
              ...t.guests,
              {
                id: `g-${Date.now()}`,
                name: trimmedName,
                dietary: newGuestDietary
              }
            ]
          };
        })
      );
    }

    setLiveAnnouncement(`Guest ${trimmedName} added to seating layout.`);
    setNewGuestName("");
    setIsAddGuestOpen(false);
  };

  const handleRemoveGuest = (tableId: string, guestId: string) => {
    if (onRemoveGuest) {
      onRemoveGuest(tableId, guestId);
    } else {
      setLocalTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, guests: t.guests.filter((g) => g.id !== guestId) } : t))
      );
    }
    setLiveAnnouncement("Guest removed from table layout.");
  };

  const getDietaryBadge = (dietary: Guest['dietary']) => {
    switch (dietary) {
      case "Vegan":
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">🌱 Vegan</span>;
      case "Gluten-Free":
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">🌾 GF</span>;
      case "Halal":
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">🕊️ Halal</span>;
      case "Jain":
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-950/80 text-pink-300 border border-pink-500/40">🕉️ Jain</span>;
      case "Vegetarian":
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-500/40">🥗 Veg</span>;
      default:
        return <span className="text-[10px] text-slate-500">Standard</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ARIA Live Status Region for Screen Readers */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="luxury" size="sm" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Interactive Floorplan & Seating Chart
            </Badge>
            <span className="text-xs text-slate-400">
              Dietary Intelligence & Table Matrix
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Guest Seating & Dietary Kitchen Summary
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time table allocations directly feeding dietary headcount breakdowns to the executive chef.
          </p>
        </div>

        <Button
          variant="luxury"
          size="sm"
          onClick={() => setIsAddGuestOpen(true)}
          className="gap-1.5 text-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Guest to Table</span>
        </Button>
      </div>

      {/* Chef's Dietary Counter Strip */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-card-3d flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Utensils className="w-4 h-4 text-cyan-400" />
          <span>Kitchen Prep Counter:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {Object.entries(dietaryCounts).map(([diet, count]) => (
            <div key={diet} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-1.5 font-mono">
              <span className="text-slate-400">{diet}:</span>
              <span className="text-cyan-400 font-bold">{count}</span>
            </div>
          ))}
          <div className="px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
            Total Seated: {allGuests.length}
          </div>
        </div>
      </div>

      {/* 3D Circular Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tables.map((table) => {
          const filled = table.guests.length;
          const pct = Math.round((filled / table.capacity) * 100);

          return (
            <Card key={table.id} className="p-5 relative group border-slate-800/90 hover:border-cyan-500/50">
              {/* Table Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/60 flex items-center justify-center font-bold text-cyan-300 text-sm shadow-neon-cyan">
                    #{table.number}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{table.name}</h3>
                    <span className="text-xs text-slate-400">
                      Capacity: {filled} / {table.capacity} Seats Filled
                    </span>
                  </div>
                </div>

                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${filled === table.capacity ? 'bg-purple-950 text-purple-300 border-purple-500/40' : 'bg-slate-950 text-cyan-400 border-cyan-500/40'}`}>
                  {pct}% Full
                </span>
              </div>

              {/* Guest Seats List */}
              <div className="py-3 space-y-2">
                {table.guests.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/30 transition-all text-xs"
                  >
                    <span className="font-medium text-slate-200">{g.name}</span>
                    <div className="flex items-center gap-2">
                      {getDietaryBadge(g.dietary)}
                      <button
                        onClick={() => handleRemoveGuest(table.id, g.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        aria-label={`Remove seat for ${g.name}`}
                        title={`Remove seat for ${g.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty Seats Placeholders */}
                {Array.from({ length: table.capacity - filled }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl border border-dashed border-slate-800/80 text-[11px] text-slate-600 flex items-center justify-center gap-1"
                  >
                    <span>Seat #{filled + idx + 1}: Open</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Guest Modal */}
      <Modal
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        title="Assign Guest to Table"
        description="Allocate attendee seat with dietary tagging for the catering team."
        maxWidth="md"
      >
        <form onSubmit={handleAddGuest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Table
            </label>
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold focus:ring-2 focus:ring-cyan-500 outline-none text-white"
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  Table #{t.number}: {t.name} ({t.guests.length}/{t.capacity} seated)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Guest Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Priya Sharma or Marcus Cole"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dietary Preference / Tag
            </label>
            <select
              value={newGuestDietary}
              onChange={(e) => setNewGuestDietary(e.target.value as Guest['dietary'])}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold focus:ring-2 focus:ring-cyan-500 outline-none text-white"
            >
              <option value="Regular">Standard Plated Dinner</option>
              <option value="Vegan">🌱 100% Vegan</option>
              <option value="Vegetarian">🥗 Lacto-Vegetarian</option>
              <option value="Gluten-Free">🌾 Gluten-Free (Celiac Safe)</option>
              <option value="Halal">🕊️ Halal Certified</option>
              <option value="Jain">🕉️ Jain Satvik (No Root Veg)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddGuestOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="luxury" size="sm">
              Confirm Seat
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
