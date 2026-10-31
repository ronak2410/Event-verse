"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, MapPin, Users, DollarSign, Palette, Utensils, Compass } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { EventDetails, EventType, Currency } from "@/lib/types";

interface EventWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent: EventDetails;
  onGeneratePlan: (event: EventDetails) => void;
  isLoading: boolean;
}

export const EventWizardModal: React.FC<EventWizardModalProps> = ({
  isOpen,
  onClose,
  initialEvent,
  onGeneratePlan,
  isLoading
}) => {
  const [formData, setFormData] = useState<EventDetails>(initialEvent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan(formData);
    onClose();
  };

  const vibeSuggestions = [
    "Earthy Tuscan vineyard with fairy lights & acoustic intimacy",
    "Modern cyberpunk neon rooftop with craft mixology",
    "Minimalist black-tie ballroom gala with grand piano",
    "Warm retro disco with glitter balls & vinyl beats",
    "Lush garden botanicals with champagne towers & string quartet"
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Event Setup & Architect Wizard"
      description="Define your celebration parameters. Our generative engine will orchestrate a synchronized 4-pillar blueprint (Budget, Timeline, Vendors, and Creative Theme)."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Celebration Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-neon-cyan outline-none"
              placeholder="e.g. Maya & Noah's Golden Vineyard Wedding"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-neon-cyan outline-none"
            >
              <option value="wedding">💍 Wedding</option>
              <option value="birthday">🎉 Birthday Gala</option>
              <option value="corporate">💼 Corporate Summit</option>
              <option value="community">🌟 Community Festival</option>
              <option value="anniversary">🥂 Milestone Anniversary</option>
            </select>
          </div>
        </div>

        {/* Budget, Currency & Guest Count */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              Total Budget
            </label>
            <input
              type="number"
              min="500"
              max="10000000"
              step="500"
              required
              value={formData.totalBudget}
              onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-semibold focus:ring-neon-cyan outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-neon-cyan outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              Guest Count
            </label>
            <input
              type="number"
              min="5"
              max="5000"
              required
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) || 1 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-semibold focus:ring-neon-cyan outline-none"
            />
          </div>
        </div>

        {/* Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Target Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-neon-cyan outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Location / City / Venue
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-neon-cyan outline-none"
              placeholder="e.g. Sonoma County, California or Grand Ballroom"
            />
          </div>
        </div>

        {/* Priority Focus */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-neon-cyan" />
            AI Budget Priority Weighting
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'balanced', label: 'Balanced', desc: 'Even spread' },
              { id: 'food_first', label: 'Foodie 1st', desc: '+8% Catering' },
              { id: 'atmosphere', label: 'Atmosphere', desc: '+6% Decor' },
              { id: 'entertainment', label: 'High Energy', desc: '+7% DJ & AV' },
              { id: 'memories', label: 'Keepsake', desc: '+7% Photo' }
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setFormData({ ...formData, priorityFocus: p.id as any })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  formData.priorityFocus === p.id
                    ? 'border-neon-cyan bg-neon-cyan/15 text-white ring-2 ring-neon-cyan/30 shadow-neon-cyan'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">{p.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Vibe / Aesthetic */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-neon-pink" />
            Aesthetic Vibe & Mood
          </label>
          <input
            type="text"
            value={formData.vibe}
            onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-neon-cyan outline-none"
            placeholder="e.g. Modern minimalist glasshouse with warm gold & sage accents"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {vibeSuggestions.slice(0, 3).map((vibe, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData({ ...formData, vibe })}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-neon-cyan/15 hover:text-neon-cyan transition-colors"
              >
                + {vibe.substring(0, 34)}...
              </button>
            ))}
          </div>
        </div>

        {/* Cultural & Dietary Nuances */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-neon-emerald" />
            Cultural Traditions & Dietary Nuances
          </label>
          <input
            type="text"
            value={formData.culturalDietary}
            onChange={(e) => setFormData({ ...formData, culturalDietary: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-neon-cyan outline-none"
            placeholder="e.g. Gluten-free dessert, Kosher plates, Mehndi tea ceremony, zero-proof mocktail bar"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="luxury" isLoading={isLoading} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate AI Blueprint
          </Button>
        </div>
      </form>
    </Modal>
  );
};
