"use client";

import React, { useState } from "react";
import { Copy, Check, Mail, Sparkles } from "lucide-react";
import { InvitationCopy } from "@/lib/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface InvitationGeneratorProps {
  copies: InvitationCopy[];
}

export const InvitationGenerator: React.FC<InvitationGeneratorProps> = ({ copies }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>(copies[0]?.style || "Modern & Chic");
  const [copied, setCopied] = useState(false);

  const activeCopy = copies.find((c) => c.style === selectedStyle) || copies[0];

  const handleCopy = () => {
    if (!activeCopy) return;
    const fullText = `Subject: ${activeCopy.subject}\n\n${activeCopy.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-amber-500" />
            AI Draft Invitation & RSVP Copywriter
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailored messaging crafted across multiple tones ready to paste into invitations or digital RSVPs.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="gap-1.5 text-xs shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-500" />
              <span>Copy Invitation</span>
            </>
          )}
        </Button>
      </div>

      {/* Style Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4">
        {copies.map((c) => (
          <button
            key={c.style}
            onClick={() => setSelectedStyle(c.style)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedStyle === c.style
                ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {c.style}
          </button>
        ))}
      </div>

      {/* Display Box */}
      {activeCopy && (
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100">
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
            Subject: {activeCopy.subject}
          </div>
          <p className="text-sm font-serif leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {activeCopy.body}
          </p>
        </div>
      )}
    </Card>
  );
};
