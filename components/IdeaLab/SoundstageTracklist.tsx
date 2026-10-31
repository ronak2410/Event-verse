"use client";

import React, { useState } from "react";
import { Music, Play, Volume2, Sparkles, Disc, Radio, Sliders } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MusicTrackIdea } from "@/lib/types";

interface SoundstageProps {
  tracks?: MusicTrackIdea[];
}

const DEFAULT_TRACKS: MusicTrackIdea[] = [
  {
    id: "track-1",
    moment: "Grand Entrance / Walk-in",
    songRecommendation: "Electric Symphony in Neo-D",
    artist: "London Contemporary Orchestra & Tycho Remix",
    bpm: 118,
    energyLevel: "High Voltage Peak"
  },
  {
    id: "track-2",
    moment: "Sunset Cocktail & Grazing Hour",
    songRecommendation: "Palace Reflections (Sitar & Chill Lo-Fi)",
    artist: "Anoushka Shankar x Bonobo",
    bpm: 94,
    energyLevel: "Groovy & Upbeat"
  },
  {
    id: "track-3",
    moment: "First Dance / Centerstage Reveal",
    songRecommendation: "Starlight Reverie (Acoustic Strings Edit)",
    artist: "Cinematic Pop Ensemble",
    bpm: 82,
    energyLevel: "Calm & Elegant"
  },
  {
    id: "track-4",
    moment: "Midnight Peak Dancefloor Finale",
    songRecommendation: "Galactic Bass & Dhol Fusion",
    artist: "DJ Sanj x KSHMR Sound System",
    bpm: 128,
    energyLevel: "High Voltage Peak"
  }
];

export const SoundstageTracklist: React.FC<SoundstageProps> = ({ tracks = DEFAULT_TRACKS }) => {
  const [playingId, setPlayingId] = useState<string | null>("track-1");
  const [isPlaying, setIsPlaying] = useState(false);

  const playlist = tracks && tracks.length > 0 ? tracks : DEFAULT_TRACKS;

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingId(id);
      setIsPlaying(true);
    }
  };

  const getEnergyBadge = (level: string) => {
    switch (level) {
      case "High Voltage Peak":
        return <Badge variant="pink" size="sm" className="text-[10px]">⚡ {level}</Badge>;
      case "Groovy & Upbeat":
        return <Badge variant="cyan" size="sm" className="text-[10px]">✨ {level}</Badge>;
      case "Calm & Elegant":
      default:
        return <Badge variant="purple" size="sm" className="text-[10px]">🌙 {level}</Badge>;
    }
  };

  return (
    <Card className="p-5 overflow-hidden card-3d">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm" className="gap-1">
              <Music className="w-3 h-3" />
              AI Sonic Curation
            </Badge>
            <span className="text-xs text-slate-400">Audio Run-of-Show</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
            Dynamic Soundstage & Playlist Blueprint
          </h3>
        </div>

        {/* Live Audio Visualizer Equalizer Simulation */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
          <div className="flex items-end gap-1 h-5 w-12">
            <span className={`w-1.5 bg-neon-cyan rounded-t transition-all duration-150 ${isPlaying ? 'h-5 animate-pulse' : 'h-2'}`} />
            <span className={`w-1.5 bg-neon-purple rounded-t transition-all duration-200 ${isPlaying ? 'h-4 animate-bounce' : 'h-3'}`} />
            <span className={`w-1.5 bg-neon-pink rounded-t transition-all duration-100 ${isPlaying ? 'h-5 animate-pulse' : 'h-1.5'}`} />
            <span className={`w-1.5 bg-neon-emerald rounded-t transition-all duration-300 ${isPlaying ? 'h-3 animate-ping' : 'h-2.5'}`} />
          </div>
          <div className="text-[11px] font-mono text-neon-cyan">
            {isPlaying ? "AUDIO SYNTH: ACTIVE" : "STATION READY"}
          </div>
        </div>
      </div>

      {/* Playlist Items */}
      <div className="space-y-2.5">
        {playlist.map((track) => {
          const isCurrent = playingId === track.id;
          return (
            <div
              key={track.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCurrent && isPlaying
                  ? "bg-slate-900 border-neon-cyan/50 shadow-neon-cyan"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => togglePlay(track.id)}
                  aria-label={`Play preview for ${track.songRecommendation}`}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform hover:scale-105 ${
                    isCurrent && isPlaying
                      ? "bg-gradient-to-tr from-neon-cyan to-neon-purple text-slate-950 shadow-neon-cyan"
                      : "bg-slate-800 text-neon-cyan hover:bg-slate-700"
                  }`}
                >
                  {isCurrent && isPlaying ? (
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neon-cyan font-mono">
                      {track.moment}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {track.bpm} BPM
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {track.songRecommendation}
                  </div>
                  <div className="text-xs text-slate-400">
                    by {track.artist}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {getEnergyBadge(track.energyLevel)}
                <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800">
                  Stem Synced
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
