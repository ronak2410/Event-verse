"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface ChatAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  messages,
  onSendMessage,
  isLoading
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Make the color palette more autumnal with champagne accents",
    "Suggest 3 interactive icebreakers for introverted guests",
    "How should we structure late-night snacks & music transition?",
    "Give me tips on negotiating with venue catering packages"
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <Card className="p-5 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Multi-Turn Creative Concierge
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Brainstorm themes, customize copy, and refine logistical edge-cases
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isUser
                    ? "bg-neon-purple text-white shadow-neon-purple"
                    : "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-neon-cyan"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-neon-purple/20 text-white border border-neon-purple/40"
                    : "bg-slate-900/90 text-slate-200 border border-slate-800"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-neon-cyan py-2">
            <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
            <span>AI Event Concierge is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="pt-2 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(p)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 hover:bg-neon-cyan/15 hover:text-neon-cyan border border-slate-800 whitespace-nowrap transition-colors"
            >
              + {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <label htmlFor="chat-input" className="sr-only">
          Message EventVerse AI Concierge
        </label>
        <input
          id="chat-input"
          type="text"
          aria-label="Message EventVerse AI Concierge"
          placeholder="Ask for color tweaks, drink recipes, playlist genres, or vendor tips..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-neon-cyan"
        />
        <Button
          type="submit"
          variant="luxury"
          size="sm"
          isLoading={isLoading}
          disabled={!inputText.trim()}
          aria-label="Send message to AI Concierge"
          className="h-10 px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
};
