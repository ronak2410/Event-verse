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
  const [viewMode, setViewMode] = useState<'blueprint' | 'cards'>('blueprint');
  const [focusedTableId, setFocusedTableId] = useState<string>(tables[0]?.id || "tbl-1");

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

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('blueprint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'blueprint'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Blueprint View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-neon-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table Cards View
            </button>
          </div>

          <Button
            variant="luxury"
            size="sm"
            onClick={() => setIsAddGuestOpen(true)}
            className="gap-1.5 text-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Guest</span>
          </Button>
        </div>
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

      {/* VIEW 1: 3D Spatial Architectural Blueprint Floorplan */}
      {viewMode === 'blueprint' && (
        <div className="space-y-4">
          <div className="relative rounded-3xl border border-cyan-500/30 bg-slate-950/95 p-6 overflow-hidden shadow-2xl">
            {/* Neon perspective ambient background */}
            <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

            {/* Stage / Podium Header */}
            <div className="relative z-10 max-w-md mx-auto mb-8 p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-cyan-950/70 to-purple-900/40 border border-cyan-400/40 text-center shadow-neon-cyan">
              <span className="text-[11px] font-bold tracking-widest text-cyan-300 uppercase">
                ★ Main Stage & Honoree Podium ★
              </span>
              <p className="text-[10px] text-slate-400">Focal Lighting Array & Audio Soundstage</p>
            </div>

            {/* Central Dancefloor / Presentation Zone */}
            <div className="relative z-10 max-w-xs mx-auto mb-8 p-4 rounded-full border border-dashed border-purple-500/40 bg-purple-950/20 text-center flex items-center justify-center">
              <span className="text-[11px] font-semibold text-purple-300 tracking-wider">
                Ambient Dancefloor / Runway
              </span>
            </div>

            {/* Spatial Circular Tables Layout */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tables.map((table) => {
                const filled = table.guests.length;
                const pct = Math.round((filled / table.capacity) * 100);
                const isSelected = table.id === focusedTableId;

                return (
                  <div
                    key={table.id}
                    onClick={() => setFocusedTableId(table.id)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border flex flex-col items-center text-center ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-900/90 shadow-neon-cyan ring-2 ring-cyan-400/40'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    {/* Radial Table Blueprint Node */}
                    <div className="relative w-32 h-32 my-3 flex items-center justify-center">
                      {/* Radial guest seat nodes around circumference */}
                      {Array.from({ length: table.capacity }).map((_, seatIdx) => {
                        const guest = table.guests[seatIdx];
                        const angle = (seatIdx / table.capacity) * 2 * Math.PI - Math.PI / 2;
                        const radius = 54;
                        const left = 64 + radius * Math.cos(angle);
                        const top = 64 + radius * Math.sin(angle);

                        const colorMap: Record<string, string> = {
                          Regular: 'bg-cyan-400 shadow-neon-cyan',
                          Vegan: 'bg-emerald-400 shadow-neon-emerald',
                          Vegetarian: 'bg-lime-400',
                          'Gluten-Free': 'bg-purple-400 shadow-neon-purple',
                          Halal: 'bg-sky-400',
                          Jain: 'bg-pink-400 shadow-neon-pink'
                        };

                        const seatGlow = guest 
                          ? (colorMap[guest.dietary] || 'bg-cyan-400')
                          : 'bg-slate-800 border border-slate-700';

                        return (
                          <div
                            key={seatIdx}
                            style={{ left: `${left}px`, top: `${top}px` }}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-transform hover:scale-125 ${seatGlow}`}
                            title={guest ? `${guest.name} (${guest.dietary})` : `Seat #${seatIdx + 1}: Open`}
                          />
                        );
                      })}

                      {/* Central Round Table Pod */}
                      <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 transition-all ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-950/80 shadow-neon-cyan' 
                          : 'border-slate-700 bg-slate-950'
                      }`}>
                        <span className="text-xs font-bold text-white">#{table.number}</span>
                        <span className="text-[10px] text-cyan-300 font-mono">{pct}%</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 truncate w-full">{table.name}</h4>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {filled} / {table.capacity} Seated
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Dietary Legend Strip */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="font-semibold text-white">Dietary Dots:</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Regular</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Vegan</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lime-400" /> Vegetarian</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Gluten-Free</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Halal</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-400" /> Jain</span>
            </div>
          </div>

          {/* Focused Table Manifest */}
          {(() => {
            const table = tables.find(t => t.id === focusedTableId) || tables[0];
            if (!table) return null;
            return (
              <Card className="p-5 border-cyan-500/40 bg-slate-900/90 shadow-card-3d">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-cyan-300 text-sm">
                      #{table.number}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{table.name} — Guest Manifest</h3>
                      <p className="text-xs text-slate-400">
                        {table.guests.length} of {table.capacity} Seats Allocated
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTableId(table.id);
                      setIsAddGuestOpen(true);
                    }}
                    className="text-xs gap-1 border-cyan-500/40 text-cyan-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Seat
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {table.guests.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs"
                    >
                      <span className="font-medium text-slate-200">{g.name}</span>
                      <div className="flex items-center gap-2">
                        {getDietaryBadge(g.dietary)}
                        <button
                          onClick={() => handleRemoveGuest(table.id, g.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          aria-label={`Remove seat for ${g.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })()}
        </div>
      )}

      {/* VIEW 2: Detailed Cards Grid View */}
      {viewMode === 'cards' && (
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
      )}

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
