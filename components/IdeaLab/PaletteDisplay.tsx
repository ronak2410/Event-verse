"use client";

import React, { useState } from "react";
import { Copy, Check, Palette } from "lucide-react";
import { ColorSwatch } from "@/lib/types";
import { Card } from "../ui/Card";

interface PaletteDisplayProps {
  palette: ColorSwatch[];
}

export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-pink-500" />
            Curated Color Palette & Swatches
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Harmonious chromatic profile crafted for decor, florals, stationery, and ambient lighting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {palette.map((swatch, idx) => {
          const isCopied = copiedHex === swatch.hex;
          return (
            <div
              key={idx}
              onClick={() => handleCopyHex(swatch.hex)}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
            >
              {/* Swatch color block */}
              <div
                className="w-full h-16 rounded-xl shadow-inner border border-black/10 flex items-end justify-end p-2 relative overflow-hidden"
                style={{ backgroundColor: swatch.hex }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-lg p-1 text-[10px] flex items-center gap-1">
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </div>
              </div>

              {/* Swatch Info */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {swatch.name}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    {swatch.hex}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {swatch.usage}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
