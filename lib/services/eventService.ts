/**
 * Service layer for interacting with EventVerse AI endpoints.
 * Decouples state management and UI components from raw HTTP requests and serialization.
 */

import { EventDetails, BudgetCategoryKey, EventVerseState } from "@/lib/types";
import { validateAiResponse } from "@/lib/utils";

export interface GeneratePlanResponse {
  allocations: EventVerseState["budgetAllocations"];
  milestones: EventVerseState["milestones"];
  dayOfSchedule: EventVerseState["dayOfSchedule"];
  vendors: EventVerseState["vendors"];
  ideaLab: EventVerseState["ideaLab"];
  aiMode: "gemini" | "mock";
}

export interface RebalanceBudgetResponse {
  allocations: Record<BudgetCategoryKey, { percentage: number; rationale: string }>;
  summaryInsight: string;
  aiMode: "gemini" | "mock";
}

export interface ChatRefineResponse {
  reply: string;
  aiMode: "gemini" | "mock";
}

export class EventServiceError extends Error {
  public status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "EventServiceError";
    this.status = status;
  }
}

/**
 * Invokes the AI Blueprint Generator endpoint to create a full multi-domain event plan.
 * Minimizes payload to only essential event summary fields.
 */
export async function requestGeneratePlan(
  event: EventDetails,
  apiKey?: string
): Promise<GeneratePlanResponse> {
  // Minimize network payload: transmit only essential event summary fields
  const minimalEvent = {
    title: event.title,
    type: event.type,
    totalBudget: event.totalBudget,
    currency: event.currency,
    guestCount: event.guestCount,
    date: event.date,
    location: event.location,
    vibe: event.vibe,
    culturalDietary: event.culturalDietary,
    priorityFocus: event.priorityFocus
  };

  let res: Response;
  try {
    res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate_plan",
        event: minimalEvent,
        apiKey: apiKey?.trim() || undefined,
      }),
    });
  } catch (netErr: unknown) {
    const msg = netErr instanceof Error ? netErr.message : "Network error";
    throw new EventServiceError(`AI Gateway connection failed: ${msg}`, 503);
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new EventServiceError(
      errorBody.error || `Failed to generate plan (Status: ${res.status})`,
      res.status
    );
  }

  const rawData: unknown = await res.json().catch(() => null);
  const val = validateAiResponse(rawData as Record<string, unknown>, "generate_plan");
  if (!val.valid) {
    throw new EventServiceError(`Invalid plan payload from AI server: ${val.error}`, 502);
  }

  // Type narrowing and explicit domain structure construction
  const record = (typeof rawData === "object" && rawData !== null ? rawData : {}) as Record<string, unknown>;
  const rawAlloc = (record.allocations || {}) as Record<string, unknown>;

  // Safe deep construction
  const allocations: GeneratePlanResponse["allocations"] = Object.keys(rawAlloc).reduce((acc, key) => {
    const item = (rawAlloc[key] || {}) as Record<string, unknown>;
    acc[key as BudgetCategoryKey] = {
      id: key as BudgetCategoryKey,
      name: typeof item.name === "string" ? item.name : key,
      percentage: typeof item.percentage === "number" ? item.percentage : 0,
      allocatedAmount: typeof item.allocatedAmount === "number" ? item.allocatedAmount : 0,
      spentAmount: typeof item.spentAmount === "number" ? item.spentAmount : 0,
      iconName: typeof item.iconName === "string" ? item.iconName : "DollarSign",
      color: typeof item.color === "string" ? item.color : "text-cyan-400",
      lightBg: typeof item.lightBg === "string" ? item.lightBg : "bg-cyan-500/10",
      aiSuggestedPercentage: typeof item.aiSuggestedPercentage === "number" ? item.aiSuggestedPercentage : undefined,
      rationale: typeof item.rationale === "string" ? item.rationale : undefined,
    };
    return acc;
  }, {} as GeneratePlanResponse["allocations"]);

  const milestones: GeneratePlanResponse["milestones"] = Array.isArray(record.milestones)
    ? record.milestones.map((m: Record<string, unknown>, idx: number) => ({
        id: typeof m.id === "string" ? m.id : `m_${idx}`,
        phase: typeof m.phase === "string" ? m.phase : "Phase",
        timeframe: typeof m.timeframe === "string" ? m.timeframe : "",
        tasks: Array.isArray(m.tasks)
          ? m.tasks.map((t: Record<string, unknown>, tIdx: number) => ({
              id: typeof t.id === "string" ? t.id : `t_${idx}_${tIdx}`,
              title: typeof t.title === "string" ? t.title : "Task",
              completed: Boolean(t.completed),
              category: (t.category as BudgetCategoryKey) || "general",
              deadlineDate: typeof t.deadlineDate === "string" ? t.deadlineDate : undefined
            }))
          : []
      }))
    : [];

  const dayOfSchedule: GeneratePlanResponse["dayOfSchedule"] = Array.isArray(record.dayOfSchedule)
    ? record.dayOfSchedule.map((s: Record<string, unknown>, idx: number) => ({
        id: typeof s.id === "string" ? s.id : `s_${idx}`,
        time: typeof s.time === "string" ? s.time : "12:00 PM",
        durationMinutes: typeof s.durationMinutes === "number" ? s.durationMinutes : 60,
        title: typeof s.title === "string" ? s.title : "Milestone",
        category: typeof s.category === "string" ? s.category : "General",
        leadPerson: typeof s.leadPerson === "string" ? s.leadPerson : "Coordinator",
        notes: typeof s.notes === "string" ? s.notes : "",
        completed: Boolean(s.completed)
      }))
    : [];

  const vendors: GeneratePlanResponse["vendors"] = Array.isArray(record.vendors)
    ? record.vendors.map((v: Record<string, unknown>, idx: number) => ({
        id: typeof v.id === "string" ? v.id : `v_${idx}`,
        name: typeof v.name === "string" ? v.name : "Vendor",
        category: (v.category as BudgetCategoryKey | 'attire' | 'transport' | 'other') || "venue",
        status: (v.status as "Researching" | "Contacted" | "Booked" | "Paid") || "Researching",
        estimatedCost: typeof v.estimatedCost === "number" ? v.estimatedCost : 0,
        actualCost: typeof v.actualCost === "number" ? v.actualCost : 0,
        contractSigned: Boolean(v.contractSigned || v.status === "Booked" || v.status === "Paid"),
        depositPaid: Boolean(v.depositPaid || v.status === "Paid"),
        notes: typeof v.notes === "string" ? v.notes : ""
      }))
    : [];

  const rawIdea = (record.ideaLab || {}) as Record<string, unknown>;
  const ideaLab: GeneratePlanResponse["ideaLab"] = {
    themeConcept: typeof rawIdea.themeConcept === "string" ? rawIdea.themeConcept : "Celebration",
    themeDescription: typeof rawIdea.themeDescription === "string" ? rawIdea.themeDescription : "",
    keyAtmosphereWords: Array.isArray(rawIdea.keyAtmosphereWords) ? rawIdea.keyAtmosphereWords.filter(w => typeof w === "string") : [],
    colorPalette: Array.isArray(rawIdea.colorPalette)
      ? rawIdea.colorPalette.map((c: Record<string, unknown>) => ({
          name: typeof c.name === "string" ? c.name : "Accent",
          hex: typeof c.hex === "string" ? c.hex : "#00F0FF",
          usage: typeof c.usage === "string" ? c.usage : "Highlight"
        }))
      : [],
    activities: Array.isArray(rawIdea.activities)
      ? rawIdea.activities.map((a: Record<string, unknown>, idx: number) => ({
          id: typeof a.id === "string" ? a.id : `act_${idx}`,
          title: typeof a.title === "string" ? a.title : "Activity",
          description: typeof a.description === "string" ? a.description : "",
          targetGroup: typeof a.targetGroup === "string" ? a.targetGroup : "All Guests",
          timeframe: typeof a.timeframe === "string" ? a.timeframe : "",
          tags: Array.isArray(a.tags) ? a.tags.filter(t => typeof t === "string") : []
        }))
      : [],
    invitationCopies: Array.isArray(rawIdea.invitationCopies)
      ? rawIdea.invitationCopies.map((inv: Record<string, unknown>) => ({
          style: (inv.style as "Formal & Royal" | "Modern & Chic" | "Warm & Whimsical" | "Short & Punchy") || "Modern & Chic",
          subject: typeof inv.subject === "string" ? inv.subject : "Invitation",
          body: typeof inv.body === "string" ? inv.body : ""
        }))
      : [],
    customChatHistory: [],
    playlistSoundtrack: Array.isArray(rawIdea.playlistSoundtrack)
      ? rawIdea.playlistSoundtrack.map((p: Record<string, unknown>, idx: number) => ({
          id: typeof p.id === "string" ? p.id : `tr_${idx}`,
          moment: typeof p.moment === "string" ? p.moment : "Highlight",
          songRecommendation: typeof p.songRecommendation === "string" ? p.songRecommendation : "Song",
          artist: typeof p.artist === "string" ? p.artist : "Artist",
          bpm: typeof p.bpm === "number" ? p.bpm : 120,
          energyLevel: (p.energyLevel as "Calm & Elegant" | "Groovy & Upbeat" | "High Voltage Peak") || "Groovy & Upbeat"
        }))
      : []
  };

  return {
    allocations,
    milestones,
    dayOfSchedule,
    vendors,
    ideaLab,
    aiMode: record.aiMode === "gemini" ? "gemini" : "mock",
  };
}

/**
 * Invokes the AI Budget Rebalancer endpoint to calculate percentage allocations.
 */
export async function requestRebalanceBudget(
  priorityFocus: EventDetails["priorityFocus"],
  totalBudget: number,
  guestCount: number,
  eventType: string,
  apiKey?: string
): Promise<RebalanceBudgetResponse> {
  let res: Response;
  try {
    res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "rebalance_budget",
        priorityFocus,
        totalBudget,
        guestCount,
        eventType,
        apiKey: apiKey?.trim() || undefined,
      }),
    });
  } catch (netErr: unknown) {
    const msg = netErr instanceof Error ? netErr.message : "Network error";
    throw new EventServiceError(`AI Gateway connection failed: ${msg}`, 503);
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new EventServiceError(
      errorBody.error || `Failed to rebalance budget (Status: ${res.status})`,
      res.status
    );
  }

  const rawData: unknown = await res.json().catch(() => null);
  const val = validateAiResponse(rawData as Record<string, unknown>, "rebalance_budget");
  if (!val.valid) {
    throw new EventServiceError(`Invalid budget rebalance payload: ${val.error}`, 502);
  }

  const record = (typeof rawData === "object" && rawData !== null ? rawData : {}) as Record<string, unknown>;
  return {
    allocations: record.allocations as RebalanceBudgetResponse["allocations"],
    summaryInsight: typeof record.summaryInsight === "string" ? record.summaryInsight : "",
    aiMode: record.aiMode === "gemini" ? "gemini" : "mock",
  };
}

/**
 * Invokes the Idea Lab conversational assistant endpoint for interactive styling advice.
 * Caps history to the last 6 messages to keep requests lean.
 */
export async function requestChatRefine(
  message: string,
  event: EventDetails,
  chatHistory: Array<{ role: string; content: string }>,
  apiKey?: string
): Promise<ChatRefineResponse> {
  const minimalEvent = {
    title: event.title,
    type: event.type,
    totalBudget: event.totalBudget,
    currency: event.currency,
    guestCount: event.guestCount,
    vibe: event.vibe,
    culturalDietary: event.culturalDietary
  };

  // Limit chat history context to last 6 messages to prevent unbounded payload growth
  const recentHistory = (chatHistory || []).slice(-6).map(m => ({
    role: m.role,
    content: (m.content || "").slice(0, 500)
  }));

  let res: Response;
  try {
    res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "chat_refine",
        message,
        event: minimalEvent,
        chatHistory: recentHistory,
        apiKey: apiKey?.trim() || undefined,
      }),
    });
  } catch (netErr: unknown) {
    const msg = netErr instanceof Error ? netErr.message : "Network error";
    throw new EventServiceError(`AI Gateway connection failed: ${msg}`, 503);
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new EventServiceError(
      errorBody.error || `Failed to process AI chat (Status: ${res.status})`,
      res.status
    );
  }

  const rawData: unknown = await res.json().catch(() => null);
  const val = validateAiResponse(rawData as Record<string, unknown>, "chat_refine");
  if (!val.valid) {
    throw new EventServiceError(`Invalid chat response from AI server: ${val.error}`, 502);
  }

  const record = (typeof rawData === "object" && rawData !== null ? rawData : {}) as Record<string, unknown>;
  return {
    reply: typeof record.reply === "string" ? record.reply : "",
    aiMode: record.aiMode === "gemini" ? "gemini" : "mock",
  };
}

