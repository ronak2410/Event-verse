"use client";

import React from "react";
import { Lightbulb, Sparkles, Wand2, Palette, Mail, MessageSquare } from "lucide-react";
import { PaletteDisplay } from "./PaletteDisplay";
import { InvitationGenerator } from "./InvitationGenerator";
import { ActivitiesList } from "./ActivitiesList";
import { SoundstageTracklist } from "./SoundstageTracklist";
import { ChatAssistant } from "./ChatAssistant";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { EventVerseState } from "@/lib/types";

interface IdeaLabSectionProps {
  state: EventVerseState;
  onSendMessage: (msg: string) => void;
  isAiLoading: boolean;
}

export const IdeaLabSection: React.FC<IdeaLabSectionProps> = ({
  state,
  onSendMessage,
  isAiLoading
}) => {
  const { ideaLab, event } = state;

  return (
    <div className="space-y-6">
      {/* Top Banner: Concept & Atmosphere */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-neon-purple/20 via-neon-pink/10 to-neon-cyan/15 border border-neon-purple/40 card-3d shadow-neon-purple">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="purple" size="sm" className="gap-1">
            <Sparkles className="w-3 h-3" />
            Personalized AI Idea Lab
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Creative Direction & Atmosphere Architecture
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {ideaLab.themeConcept}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-4xl">
          {ideaLab.themeDescription}
        </p>

        {/* Atmosphere Keywords */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-purple-100 dark:border-purple-900/40">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
            Vibe Signatures:
          </span>
          {ideaLab.keyAtmosphereWords?.map((word, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
            >
              ✦ {word}
            </span>
          ))}
        </div>
      </div>

      {/* Grid: Left Column (Palette & Activities & Invitations), Right Column (Multi-turn Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Palette */}
          <PaletteDisplay palette={ideaLab.colorPalette} />

          {/* Invitations */}
          <InvitationGenerator copies={ideaLab.invitationCopies} />

          {/* Activities */}
          <ActivitiesList activities={ideaLab.activities} />

          {/* AI Sonic Run-of-Show / Music Blueprint */}
          <SoundstageTracklist tracks={ideaLab.playlistSoundtrack} />
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <ChatAssistant
              messages={ideaLab.customChatHistory}
              onSendMessage={onSendMessage}
              isLoading={isAiLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
