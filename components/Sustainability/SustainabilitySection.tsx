"use client";

import React, { useState } from "react";
import { 
  Leaf, 
  Car, 
  UtensilsCrossed, 
  Lightbulb, 
  Gift, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight,
  TrendingDown,
  DollarSign,
  Award
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EventDetails } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface EcoPillar {
  id: string;
  category: "Transport & Travel" | "Dining & Food Rescue" | "Decor & Florals" | "Energy & AV" | "Gifting & Swag";
  title: string;
  baselineCO2Kg: number;
  optimizedCO2Kg: number;
  costSavingsUSD: number;
  recommendation: string;
  badgeLabel: string;
  isImplemented: boolean;
}

const DEFAULT_ECO_PILLARS: EcoPillar[] = [
  {
    id: "eco-1",
    category: "Dining & Food Rescue",
    title: "Zero-Food-Waste Commercial Compost & Safe Shelter Donation",
    baselineCO2Kg: 520,
    optimizedCO2Kg: 85,
    costSavingsUSD: 1400,
    recommendation: "Partner with regional food rescue (e.g., Robin Hood Army / City Harvest) for immediate post-service chilled collection, with excess trim sent to organic compost.",
    badgeLabel: "84% Waste Reduced",
    isImplemented: true
  },
  {
    id: "eco-2",
    category: "Decor & Florals",
    title: "Potted Living Botanicals & Sustainable Flower Re-purposing",
    baselineCO2Kg: 410,
    optimizedCO2Kg: 110,
    costSavingsUSD: 1850,
    recommendation: "Replace single-use floral foam and cut blooms with rentable living olive trees, potted orchids, and compostable twine installations that guests can take home.",
    badgeLabel: "73% Less Landfill",
    isImplemented: true
  },
  {
    id: "eco-3",
    category: "Transport & Travel",
    title: "Guest Group Shuttles & EV Valet Fleet Optimization",
    baselineCO2Kg: 940,
    optimizedCO2Kg: 290,
    costSavingsUSD: 850,
    recommendation: "Centralized electric sprinter shuttle departures from partner hotels reduces 80+ individual car trips down to 4 timed zero-emission routes.",
    badgeLabel: "69% Emission Cut",
    isImplemented: false
  },
  {
    id: "eco-4",
    category: "Energy & AV",
    title: "Solar Battery Storage Pack & Ultra-Efficient Laser LED Lighting",
    baselineCO2Kg: 380,
    optimizedCO2Kg: 65,
    costSavingsUSD: 600,
    recommendation: "Swap conventional incandescent wash lamps for DMX-controlled LED moving fixtures powered by rechargeable 10kWh silent lithium power banks.",
    badgeLabel: "83% Power Saved",
    isImplemented: false
  },
  {
    id: "eco-5",
    category: "Gifting & Swag",
    title: "Digital NFC Keepsakes & Seed-Paper Artisanal Favors",
    baselineCO2Kg: 210,
    optimizedCO2Kg: 15,
    costSavingsUSD: 720,
    recommendation: "Eliminate plastic trinkets and paper print runs in favor of tap-to-phone NFC guest passes and wildflower seed bookmarks pressed on recycled cotton.",
    badgeLabel: "92% Less Paper",
    isImplemented: true
  }
];

export const SustainabilitySection: React.FC<{ event: EventDetails }> = ({ event }) => {
  const [pillars, setPillars] = useState<EcoPillar[]>(DEFAULT_ECO_PILLARS);

  const togglePillar = (id: string) => {
    setPillars(prev => prev.map(p => p.id === id ? { ...p, isImplemented: !p.isImplemented } : p));
  };

  const totalBaseline = pillars.reduce((acc, p) => acc + p.baselineCO2Kg, 0);
  const currentCO2 = pillars.reduce((acc, p) => acc + (p.isImplemented ? p.optimizedCO2Kg : p.baselineCO2Kg), 0);
  const totalSavedCO2 = totalBaseline - currentCO2;
  const totalCostSaved = pillars.filter(p => p.isImplemented).reduce((acc, p) => acc + p.costSavingsUSD, 0);
  const percentReduced = Math.round((totalSavedCO2 / totalBaseline) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-neon-emerald/20 via-neon-cyan/15 to-transparent border border-neon-emerald/40 card-3d shadow-neon-emerald flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" size="sm" className="gap-1">
              <Leaf className="w-3.5 h-3.5 text-neon-emerald" />
              Green Event Architecture
            </Badge>
            <span className="text-xs text-slate-400">
              Zero-Waste & ESG Compliance
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            AI Carbon & Eco-Impact Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Simulate and eliminate carbon footprints across catering, logistics, florals, and energy with actionable green recommendations and estimated cost savings.
          </p>
        </div>

        {/* ESG Certificate Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-neon-emerald/40 shrink-0">
          <Award className="w-8 h-8 text-neon-emerald shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-neon-emerald">
              Event Certification
            </div>
            <div className="text-sm font-bold text-white">
              {percentReduced >= 60 ? "Level III Eco-Gold" : percentReduced >= 40 ? "Level II Eco-Silver" : "Level I Eco-Certified"}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 flex items-center justify-between card-3d">
          <div>
            <div className="text-xs text-slate-400">Carbon Abatement</div>
            <div className="text-xl font-bold text-neon-emerald mt-0.5">
              -{totalSavedCO2} kg CO₂
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {percentReduced}% total emissions reduced
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-neon-emerald/20 text-neon-emerald shadow-neon-emerald">
            <TrendingDown className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between card-3d">
          <div>
            <div className="text-xs text-slate-400">Eco Cost Savings</div>
            <div className="text-xl font-bold text-neon-cyan mt-0.5">
              {formatCurrency(totalCostSaved, event.currency)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Through rentals & bulk logistics
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-neon-cyan/20 text-neon-cyan shadow-neon-cyan">
            <DollarSign className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between card-3d">
          <div>
            <div className="text-xs text-slate-400">Initiatives Active</div>
            <div className="text-xl font-bold text-neon-purple mt-0.5">
              {pillars.filter(p => p.isImplemented).length} / {pillars.length} Implemented
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Click cards below to toggle
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-neon-purple/20 text-neon-purple shadow-neon-purple">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Interactive Eco Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-emerald" />
            Sustainable Operations Pillars
          </h3>
          <span className="text-xs text-slate-500">Toggle initiatives to recalculate ESG impact</span>
        </div>

        {pillars.map((pillar) => (
          <Card
            key={pillar.id}
            className={`p-4 sm:p-5 transition-all card-3d ${
              pillar.isImplemented
                ? "border-neon-emerald/60 bg-slate-900/90 shadow-neon-emerald"
                : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={pillar.isImplemented ? "success" : "outline"} size="sm">
                    {pillar.category}
                  </Badge>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-neon-emerald">
                    {pillar.badgeLabel}
                  </span>
                  <span className="text-xs text-slate-400">
                    Est. Savings: <strong className="text-neon-cyan">{formatCurrency(pillar.costSavingsUSD, event.currency)}</strong>
                  </span>
                </div>

                <div className="text-base font-bold text-white">
                  {pillar.title}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {pillar.recommendation}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-400">
                  <span>Baseline: <strong className="text-slate-200">{pillar.baselineCO2Kg} kg CO₂</strong></span>
                  <span>→</span>
                  <span>Optimized: <strong className="text-neon-emerald">{pillar.optimizedCO2Kg} kg CO₂</strong></span>
                  <span className="text-neon-emerald font-bold">(-{pillar.baselineCO2Kg - pillar.optimizedCO2Kg} kg)</span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                <Button
                  size="sm"
                  variant={pillar.isImplemented ? "luxury" : "outline"}
                  onClick={() => togglePillar(pillar.id)}
                  aria-label={pillar.isImplemented ? `Remove sustainability strategy: ${pillar.title}` : `Adopt sustainability strategy: ${pillar.title}`}
                  className={`gap-1.5 text-xs ${
                    pillar.isImplemented
                      ? "bg-gradient-to-r from-neon-emerald to-neon-cyan text-slate-950 font-bold"
                      : "border-slate-700 text-slate-300 hover:border-neon-emerald hover:text-neon-emerald"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{pillar.isImplemented ? "Implemented" : "Adopt Strategy"}</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
