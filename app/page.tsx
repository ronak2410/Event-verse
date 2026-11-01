"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { QuickTemplates } from "@/components/QuickTemplates";
import { StatHighlights } from "@/components/StatHighlights";
import { EventWizardModal } from "@/components/EventWizardModal";
import { BudgetSection } from "@/components/BudgetEstimator/BudgetSection";
import { TimelineSection } from "@/components/Timeline/TimelineSection";
import { VendorSection } from "@/components/VendorTracker/VendorSection";
import { IdeaLabSection } from "@/components/IdeaLab/IdeaLabSection";
import { SeatingSection } from "@/components/SeatingChart/SeatingSection";
import { ContingencyMatrixSection } from "@/components/Contingency/ContingencyMatrixSection";
import { SustainabilitySection } from "@/components/Sustainability/SustainabilitySection";
import { useEventState } from "@/hooks/useEventState";
import { Sparkles, ShieldCheck, Heart, Github, ExternalLink } from "lucide-react";

export default function Home() {
  const {
    state,
    isHydrated,
    isAiLoading,
    userApiKey,
    activeTab,
    setActiveTab,
    saveApiKey,
    loadTemplate,
    updateEventDetails,
    updateCategoryPercentage,
    normalizeAllocations,
    applyAIRebalance,
    regenerateEventWithAI,
    toggleMilestoneTask,
    addMilestoneTask,
    toggleDayOfItem,
    addDayOfItem,
    updateVendorStatus,
    addVendor,
    updateVendor,
    deleteVendor,
    addGuestToTable,
    removeGuestFromTable,
    sendIdeaLabMessage,
    resetToDefault
  } = useEventState();

  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // If loading local state on initial client hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 cyber-grid">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-neon-cyan via-neon-purple to-neon-pink flex items-center justify-center animate-pulse shadow-neon-cyan">
            <Sparkles className="w-7 h-7 text-slate-950" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-neon-cyan animate-pulse">
            Initializing EventVerse AI Architect...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Accessible Skip-to-Content Link for Screen Readers & Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-400 focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-300"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header
        state={state}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWizard={() => setIsWizardOpen(true)}
        onReset={resetToDefault}
        userApiKey={userApiKey}
        onSaveApiKey={saveApiKey}
      />

      {/* Quick Templates Strip for Hackathon Evaluators */}
      <QuickTemplates
        currentType={state.event.type}
        onSelectTemplate={loadTemplate}
      />

      {/* Main Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none">
        {/* At-a-glance Stat Highlights */}
        <StatHighlights state={state} />

        {/* Accessible W3C Tabpanel Container */}
        <section
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="focus:outline-none"
        >
          {/* Tab 1: Dynamic Budget Estimator */}
          {activeTab === "budget" && (
            <BudgetSection
              state={state}
              onUpdatePercentage={updateCategoryPercentage}
              onNormalize={normalizeAllocations}
              onApplyAIRebalance={applyAIRebalance}
              onUpdateTotalBudget={(totalBudget) => updateEventDetails({ totalBudget })}
              isAiLoading={isAiLoading}
            />
          )}

          {/* Tab 2: Timeline & Day-of Schedule */}
          {activeTab === "timeline" && (
            <TimelineSection
              state={state}
              onToggleMilestoneTask={toggleMilestoneTask}
              onAddMilestoneTask={addMilestoneTask}
              onToggleDayOfItem={toggleDayOfItem}
              onAddDayOfItem={addDayOfItem}
            />
          )}

          {/* Tab 3: Interactive Vendor Checklist */}
          {activeTab === "vendors" && (
            <VendorSection
              state={state}
              onUpdateVendorStatus={updateVendorStatus}
              onAddVendor={addVendor}
              onUpdateVendor={updateVendor}
              onDeleteVendor={deleteVendor}
            />
          )}

          {/* Tab 4: Personalized AI Idea Lab */}
          {activeTab === "idealab" && (
            <IdeaLabSection
              state={state}
              onSendMessage={sendIdeaLabMessage}
              isAiLoading={isAiLoading}
            />
          )}

          {/* Tab 5: Interactive 3D Seating Chart & Dietary Floorplan */}
          {activeTab === "seating" && (
            <SeatingSection
              state={state}
              onAddGuest={addGuestToTable}
              onRemoveGuest={removeGuestFromTable}
            />
          )}

          {/* Tab 6: Plan B Weather & Contingency Matrix */}
          {activeTab === "contingency" && (
            <ContingencyMatrixSection event={state.event} />
          )}

          {/* Tab 7: AI Carbon & ESG Sustainability Engine */}
          {activeTab === "sustainability" && (
            <SustainabilitySection event={state.event} />
          )}
        </section>
      </main>

      {/* Event Setup Wizard Modal */}
      <EventWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialEvent={state.event}
        onGeneratePlan={regenerateEventWithAI}
        isLoading={isAiLoading}
      />

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">EventVerse</span>
            <span>•</span>
            <span>AI Celebration & Event Planner</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Deterministic Smart Fallback + Google Gemini API Ready</span>
            <span>•</span>
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
