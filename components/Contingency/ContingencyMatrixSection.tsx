"use client";

import React, { useState } from "react";
import { 
  CloudRain, 
  Sun, 
  Wind, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  Zap,
  Building,
  RefreshCw,
  Clock,
  Layers
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EventDetails } from "@/lib/types";

interface WeatherRiskItem {
  id: string;
  category: "Weather & Outdoor" | "Vendor & Logistics" | "Power & Audio" | "Guest & Transit";
  hazard: string;
  probability: "High" | "Medium" | "Low";
  severity: "Critical" | "Moderate" | "Minor";
  backupPlanA: string;
  backupPlanB: string;
  triggerDeadlineHoursBefore: number;
  assignedLead: string;
  activated: boolean;
}

const DEFAULT_RISKS: WeatherRiskItem[] = [
  {
    id: "risk-1",
    category: "Weather & Outdoor",
    hazard: "Rain / Thunderstorm during outdoor cocktail hour or ceremony",
    probability: "Medium",
    severity: "Critical",
    backupPlanA: "Seamless pivot to Glasshouse Pavilion / covered veranda",
    backupPlanB: "Rapid clear marquee deployment with ambient perimeter heaters",
    triggerDeadlineHoursBefore: 4,
    assignedLead: "Venue Director (Ananya M.)",
    activated: false
  },
  {
    id: "risk-2",
    category: "Power & Audio",
    hazard: "Generator voltage drop or main circuit trip during peak live set",
    probability: "Low",
    severity: "Critical",
    backupPlanA: "Auxiliary 65kVA silent diesel generator with automatic failover switch",
    backupPlanB: "Battery-powered wireless acoustic PA for continuous dining ambience",
    triggerDeadlineHoursBefore: 24,
    assignedLead: "Lead Sound Engineer (Marcus V.)",
    activated: false
  },
  {
    id: "risk-3",
    category: "Vendor & Logistics",
    hazard: "Catering truck delay or cold room breakdown",
    probability: "Low",
    severity: "Critical",
    backupPlanA: "Pre-staged dry goods & secondary induction warming stations",
    backupPlanB: "Expedited backup delivery from regional commercial commissary",
    triggerDeadlineHoursBefore: 6,
    assignedLead: "Executive Chef (Vikram Rathore)",
    activated: false
  },
  {
    id: "risk-4",
    category: "Guest & Transit",
    hazard: "Peak hour traffic bottleneck or parking overflow at main estate gates",
    probability: "High",
    severity: "Moderate",
    backupPlanA: "Off-site satellite lot shuttle service every 7 minutes",
    backupPlanB: "Express golf-cart valet escort direct to registration terrace",
    triggerDeadlineHoursBefore: 2,
    assignedLead: "Head Concierge (Kishan S.)",
    activated: false
  }
];

export const ContingencyMatrixSection: React.FC<{ event: EventDetails }> = ({ event }) => {
  const [risks, setRisks] = useState<WeatherRiskItem[]>(DEFAULT_RISKS);
  const [simulatedRain, setSimulatedRain] = useState(false);

  const toggleActivate = (id: string) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, activated: !r.activated } : r));
  };

  const handleSimulateWeatherCrisis = () => {
    setSimulatedRain(true);
    setRisks(prev => prev.map(r => r.category === "Weather & Outdoor" ? { ...r, activated: true } : r));
  };

  const handleResetWeather = () => {
    setSimulatedRain(false);
    setRisks(prev => prev.map(r => r.category === "Weather & Outdoor" ? { ...r, activated: false } : r));
  };

  const activatedCount = risks.filter(r => r.activated).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-neon-purple/20 via-neon-cyan/15 to-transparent border border-neon-cyan/40 card-3d shadow-neon-cyan flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" size="sm" className="gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Operational Resilience
            </Badge>
            <span className="text-xs text-slate-400">
              Weather & Failover Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Plan B Contingency & Weather Failover Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Simulate real-time crisis scenarios (sudden downpours, power outages, vendor delays) with instant trigger deadlines and failover routing.
          </p>
        </div>

        {/* Live Weather Simulator Controls */}
        <div className="flex items-center gap-2.5">
          {simulatedRain ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetWeather}
              className="gap-1.5 text-xs border-neon-pink text-neon-pink hover:bg-neon-pink/15"
            >
              <Sun className="w-4 h-4 text-neon-cyan" />
              <span>Clear Sky Weather</span>
            </Button>
          ) : (
            <Button
              variant="luxury"
              size="sm"
              onClick={handleSimulateWeatherCrisis}
              className="gap-1.5 text-xs"
            >
              <CloudRain className="w-4 h-4 text-neon-cyan" />
              <span>Simulate Storm Alert</span>
            </Button>
          )}
        </div>
      </div>

      {/* Real-time Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 flex items-center justify-between card-3d">
          <div>
            <div className="text-xs text-slate-400">Weather Status</div>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
              {simulatedRain ? (
                <>
                  <CloudRain className="w-4 h-4 text-neon-pink animate-bounce" />
                  <span className="text-neon-pink">Rain Imminent (85% PoP)</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-neon-cyan" />
                  <span className="text-neon-cyan">Ideal Conditions (22°C Clear)</span>
                </>
              )}
            </div>
          </div>
          <div className="text-xs font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            Radar Active
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between card-3d">
          <div>
            <div className="text-xs text-slate-400">Active Protocols</div>
            <div className="text-sm font-bold text-white mt-0.5">
              <span className={activatedCount > 0 ? "text-neon-pink" : "text-neon-emerald"}>
                {activatedCount} Protocols Triggered
              </span>
            </div>
          </div>
          <div className={`p-2 rounded-xl ${activatedCount > 0 ? 'bg-neon-pink/20 text-neon-pink' : 'bg-neon-emerald/20 text-neon-emerald'}`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between card-3d">
          <div>
            <div className="text-xs text-slate-400">Contingency Reserve</div>
            <div className="text-sm font-bold text-neon-cyan mt-0.5">
              5% Total Budget ($3,000 Buffer)
            </div>
          </div>
          <div className="p-2 rounded-xl bg-neon-cyan/20 text-neon-cyan">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </Card>
      </div>

      {/* Contingency Protocols Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-neon-purple" />
            Active Threat & Failover Matrix
          </h3>
          <span className="text-xs text-slate-500">Click any protocol to activate Plan B</span>
        </div>

        {risks.map((risk) => (
          <Card
            key={risk.id}
            className={`p-4 sm:p-5 transition-all card-3d ${
              risk.activated
                ? "border-neon-pink/60 bg-slate-900/90 shadow-neon-pink"
                : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={risk.category === "Weather & Outdoor" ? "cyan" : "purple"} size="sm">
                    {risk.category}
                  </Badge>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    risk.severity === "Critical" 
                      ? "bg-neon-pink/15 text-neon-pink border-neon-pink/40" 
                      : "bg-neon-purple/15 text-neon-purple border-neon-purple/40"
                  }`}>
                    {risk.severity} Severity
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Cut-off: <strong>T-{risk.triggerDeadlineHoursBefore}h before start</strong>
                  </span>
                </div>

                <div className="text-base font-bold text-white">
                  {risk.hazard}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <span className="font-bold text-neon-cyan block mb-0.5">Plan A (Preferred Failover):</span>
                    <span className="text-slate-300">{risk.backupPlanA}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <span className="font-bold text-neon-purple block mb-0.5">Plan B (Emergency Redundancy):</span>
                    <span className="text-slate-300">{risk.backupPlanB}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 pt-1">
                  Designated Incident Lead: <strong className="text-white">{risk.assignedLead}</strong>
                </div>
              </div>

              {/* Activation Trigger Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant={risk.activated ? "destructive" : "outline"}
                  onClick={() => toggleActivate(risk.id)}
                  aria-label={risk.activated ? `Deactivate protocol for ${risk.hazard}` : `Trigger failover protocol for ${risk.hazard}`}
                  className={`gap-1.5 text-xs w-full sm:w-auto ${
                    risk.activated
                      ? "bg-neon-pink text-slate-950 font-bold border-neon-pink shadow-neon-pink"
                      : "border-slate-700 text-slate-300 hover:border-neon-cyan hover:text-neon-cyan"
                  }`}
                >
                  {risk.activated ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Plan B ACTIVE
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      Trigger Protocol
                    </>
                  )}
                </Button>
                {risk.activated && (
                  <span className="text-[10px] font-mono text-neon-pink animate-pulse">
                    Staff Dispatched to Staging
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
