"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  EventVerseState, 
  EventDetails, 
  BudgetCategoryKey, 
  Vendor, 
  VendorStatus,
  DayOfScheduleItem,
  MilestoneTask
} from "@/lib/types";
import { TEMPLATE_WEDDING, TEMPLATE_BIRTHDAY, TEMPLATE_CORPORATE, TEMPLATE_ROYAL_SANGEET, buildCategoryAllocations } from "@/lib/mockData";
import { generateDeterministicSmartPlan } from "@/lib/gemini";

const STORAGE_KEY = "eventverse_state_v1";

export function useEventState() {
  const [state, setState] = useState<EventVerseState>(TEMPLATE_WEDDING);
  const [isHydrated, setIsHydrated] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline' | 'vendors' | 'idealab' | 'seating'>('budget');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
      const savedKey = localStorage.getItem("eventverse_gemini_key");
      if (savedKey) {
        setUserApiKey(savedKey);
      }
    } catch (e) {
      console.error("Failed to load EventVerse state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error("Failed to persist EventVerse state to localStorage:", e);
      }
    }
  }, [state, isHydrated]);

  const saveApiKey = useCallback((key: string) => {
    setUserApiKey(key);
    try {
      localStorage.setItem("eventverse_gemini_key", key);
    } catch (e) {}
  }, []);

  // Load standard template
  const loadTemplate = useCallback((templateType: 'wedding' | 'birthday' | 'corporate' | 'sangeet') => {
    if (templateType === 'wedding') setState({ ...TEMPLATE_WEDDING, lastUpdated: new Date().toISOString() });
    else if (templateType === 'birthday') setState({ ...TEMPLATE_BIRTHDAY, lastUpdated: new Date().toISOString() });
    else if (templateType === 'corporate') setState({ ...TEMPLATE_CORPORATE, lastUpdated: new Date().toISOString() });
    else if (templateType === 'sangeet') setState({ ...TEMPLATE_ROYAL_SANGEET, lastUpdated: new Date().toISOString() });
  }, []);

  // Update Event Details (e.g. Budget, Guest Count, Vibe)
  const updateEventDetails = useCallback((updates: Partial<EventDetails>) => {
    setState(prev => {
      const updatedEvent = { ...prev.event, ...updates };
      // If totalBudget changed, re-calculate dollar amounts for each category based on current percentage
      let updatedAllocations = { ...prev.budgetAllocations };
      if (updates.totalBudget !== undefined) {
        Object.keys(updatedAllocations).forEach(k => {
          const key = k as BudgetCategoryKey;
          const cat = updatedAllocations[key];
          updatedAllocations[key] = {
            ...cat,
            allocatedAmount: Math.round((updatedEvent.totalBudget * cat.percentage) / 100)
          };
        });
      }

      return {
        ...prev,
        event: updatedEvent,
        budgetAllocations: updatedAllocations,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // Update specific category percentage slider
  const updateCategoryPercentage = useCallback((categoryKey: BudgetCategoryKey, newPercentage: number) => {
    setState(prev => {
      const currentAllocations = { ...prev.budgetAllocations };
      const currentCat = currentAllocations[categoryKey];
      if (!currentCat) return prev;

      currentAllocations[categoryKey] = {
        ...currentCat,
        percentage: newPercentage,
        allocatedAmount: Math.round((prev.event.totalBudget * newPercentage) / 100)
      };

      return {
        ...prev,
        budgetAllocations: currentAllocations,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // Normalize percentages so they equal 100%
  const normalizeAllocations = useCallback(() => {
    setState(prev => {
      const cats = Object.values(prev.budgetAllocations);
      const totalPct = cats.reduce((acc, c) => acc + c.percentage, 0);
      if (totalPct === 0) return prev;

      const newAllocations = { ...prev.budgetAllocations };
      let accumulated = 0;
      cats.forEach((cat, idx) => {
        let newPct = Math.round((cat.percentage / totalPct) * 100);
        if (idx === cats.length - 1) {
          newPct = 100 - accumulated;
        } else {
          accumulated += newPct;
        }
        newAllocations[cat.id] = {
          ...cat,
          percentage: newPct,
          allocatedAmount: Math.round((prev.event.totalBudget * newPct) / 100)
        };
      });

      return {
        ...prev,
        budgetAllocations: newAllocations,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // AI Reallocate Budget
  const applyAIRebalance = useCallback(async (priorityFocus: EventDetails['priorityFocus']) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rebalance_budget",
          priorityFocus,
          totalBudget: state.event.totalBudget,
          guestCount: state.event.guestCount,
          eventType: state.event.type,
          apiKey: userApiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        setState(prev => {
          const newAllocations = { ...prev.budgetAllocations };
          if (data.allocations) {
            Object.keys(data.allocations).forEach(k => {
              const key = k as BudgetCategoryKey;
              if (newAllocations[key]) {
                const newPct = data.allocations[key].percentage;
                newAllocations[key] = {
                  ...newAllocations[key],
                  percentage: newPct,
                  allocatedAmount: Math.round((prev.event.totalBudget * newPct) / 100),
                  rationale: data.allocations[key].rationale || newAllocations[key].rationale,
                  aiSuggestedPercentage: newPct
                };
              }
            });
          }

          return {
            ...prev,
            event: { ...prev.event, priorityFocus },
            budgetAllocations: newAllocations,
            aiMode: data.aiMode || prev.aiMode,
            lastUpdated: new Date().toISOString()
          };
        });
      }
    } catch (e) {
      console.error("AI Rebalance error:", e);
    } finally {
      setIsAiLoading(false);
    }
  }, [state.event, userApiKey]);

  // Regenerate Complete Event Blueprint with AI
  const regenerateEventWithAI = useCallback(async (customEvent?: EventDetails) => {
    setIsAiLoading(true);
    const targetEvent = customEvent || state.event;
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_plan",
          event: targetEvent,
          apiKey: userApiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        setState(prev => ({
          ...prev,
          event: targetEvent,
          budgetAllocations: data.allocations,
          milestones: data.milestones,
          dayOfSchedule: data.dayOfSchedule,
          vendors: data.vendors,
          ideaLab: data.ideaLab,
          aiMode: data.aiMode || 'mock',
          lastUpdated: new Date().toISOString()
        }));
      } else {
        // Fallback local smart plan
        const fallback = generateDeterministicSmartPlan(targetEvent);
        setState(prev => ({
          ...prev,
          event: targetEvent,
          budgetAllocations: fallback.allocations as any,
          milestones: fallback.milestones,
          dayOfSchedule: fallback.dayOfSchedule,
          vendors: fallback.vendors,
          ideaLab: fallback.ideaLab,
          aiMode: 'mock',
          lastUpdated: new Date().toISOString()
        }));
      }
    } catch (e) {
      console.warn("Generating with local deterministic engine:", e);
      const fallback = generateDeterministicSmartPlan(targetEvent);
      setState(prev => ({
        ...prev,
        event: targetEvent,
        budgetAllocations: fallback.allocations as any,
        milestones: fallback.milestones,
        dayOfSchedule: fallback.dayOfSchedule,
        vendors: fallback.vendors,
        ideaLab: fallback.ideaLab,
        aiMode: 'mock',
        lastUpdated: new Date().toISOString()
      }));
    } finally {
      setIsAiLoading(false);
    }
  }, [state.event, userApiKey]);

  // Toggle milestone task completion
  const toggleMilestoneTask = useCallback((milestoneId: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          tasks: m.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Add custom task to milestone
  const addMilestoneTask = useCallback((milestoneId: string, title: string, category: BudgetCategoryKey | 'general' = 'general') => {
    setState(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          tasks: [
            ...m.tasks,
            { id: `t-custom-${Date.now()}`, title, completed: false, category }
          ]
        };
      }),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Toggle Day of Schedule item
  const toggleDayOfItem = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      dayOfSchedule: prev.dayOfSchedule.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Add Day of Schedule item
  const addDayOfItem = useCallback((item: Omit<DayOfScheduleItem, 'id' | 'completed'>) => {
    setState(prev => ({
      ...prev,
      dayOfSchedule: [
        ...prev.dayOfSchedule,
        {
          ...item,
          id: `dos-custom-${Date.now()}`,
          completed: false
        }
      ].sort((a, b) => a.time.localeCompare(b.time)),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Vendor actions: update status, add vendor, edit vendor, delete vendor
  const updateVendorStatus = useCallback((vendorId: string, status: VendorStatus) => {
    setState(prev => ({
      ...prev,
      vendors: prev.vendors.map(v => v.id === vendorId ? { ...v, status } : v),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const addVendor = useCallback((vendor: Omit<Vendor, 'id'>) => {
    setState(prev => {
      const newVendor: Vendor = {
        ...vendor,
        id: `v-custom-${Date.now()}`
      };
      
      // Update spent amount in matching category if vendor is Booked or Paid
      const newAllocations = { ...prev.budgetAllocations };
      const catKey = vendor.category as BudgetCategoryKey;
      if (newAllocations[catKey] && (vendor.status === 'Booked' || vendor.status === 'Paid')) {
        newAllocations[catKey] = {
          ...newAllocations[catKey],
          spentAmount: newAllocations[catKey].spentAmount + vendor.actualCost
        };
      }

      return {
        ...prev,
        vendors: [newVendor, ...prev.vendors],
        budgetAllocations: newAllocations,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const updateVendor = useCallback((vendorId: string, updates: Partial<Vendor>) => {
    setState(prev => ({
      ...prev,
      vendors: prev.vendors.map(v => v.id === vendorId ? { ...v, ...updates } : v),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const deleteVendor = useCallback((vendorId: string) => {
    setState(prev => ({
      ...prev,
      vendors: prev.vendors.filter(v => v.id !== vendorId),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Idea Lab: send chat message
  const sendIdeaLabMessage = useCallback(async (userMessageText: string) => {
    if (!userMessageText.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user' as const,
      content: userMessageText,
      timestamp: new Date().toISOString()
    };

    // Optimistically update chat
    setState(prev => ({
      ...prev,
      ideaLab: {
        ...prev.ideaLab,
        customChatHistory: [...prev.ideaLab.customChatHistory, userMsg]
      }
    }));

    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat_refine",
          message: userMessageText,
          event: state.event,
          apiKey: userApiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg = {
          id: `ai-${Date.now()}`,
          role: 'assistant' as const,
          content: data.reply || "I've noted that! What else would you like to explore?",
          timestamp: new Date().toISOString()
        };

        setState(prev => ({
          ...prev,
          ideaLab: {
            ...prev.ideaLab,
            customChatHistory: [...prev.ideaLab.customChatHistory, assistantMsg]
          },
          aiMode: data.aiMode || prev.aiMode
        }));
      }
    } catch (e) {
      console.error("Chat error:", e);
    } finally {
      setIsAiLoading(false);
    }
  }, [state.event, userApiKey]);

  // Reset to default
  const resetToDefault = useCallback(() => {
    setState(TEMPLATE_WEDDING);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
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
    sendIdeaLabMessage,
    resetToDefault
  };
}
