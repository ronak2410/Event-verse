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

  const rawData = await res.json().catch(() => null);
  const val = validateAiResponse(rawData, "generate_plan");
  if (!val.valid) {
    throw new EventServiceError(`Invalid plan payload from AI server: ${val.error}`, 502);
  }

  return rawData as GeneratePlanResponse;
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

  const rawData = await res.json().catch(() => null);
  const val = validateAiResponse(rawData, "rebalance_budget");
  if (!val.valid) {
    throw new EventServiceError(`Invalid budget rebalance payload: ${val.error}`, 502);
  }

  return rawData as RebalanceBudgetResponse;
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

  const rawData = await res.json().catch(() => null);
  const val = validateAiResponse(rawData, "chat_refine");
  if (!val.valid) {
    throw new EventServiceError(`Invalid chat response from AI server: ${val.error}`, 502);
  }

  return rawData as ChatRefineResponse;
}

