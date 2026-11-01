/**
 * Service layer for interacting with EventVerse AI endpoints.
 * Decouples state management and UI components from raw HTTP requests and serialization.
 */

import { EventDetails, BudgetCategoryKey, EventVerseState } from "@/lib/types";

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
 */
export async function requestGeneratePlan(
  event: EventDetails,
  apiKey?: string
): Promise<GeneratePlanResponse> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "generate_plan",
      event,
      apiKey: apiKey?.trim() || undefined,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new EventServiceError(
      errorBody.error || `Failed to generate plan (Status: ${res.status})`,
      res.status
    );
  }

  return (await res.json()) as GeneratePlanResponse;
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
  const res = await fetch("/api/ai", {
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

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new EventServiceError(
      errorBody.error || `Failed to rebalance budget (Status: ${res.status})`,
      res.status
    );
  }

  return (await res.json()) as RebalanceBudgetResponse;
}

/**
 * Invokes the Idea Lab conversational assistant endpoint for interactive styling advice.
 */
export async function requestChatRefine(
  message: string,
  event: EventDetails,
  chatHistory: Array<{ role: string; content: string }>,
  apiKey?: string
): Promise<ChatRefineResponse> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "chat_refine",
      message,
      event,
      chatHistory,
      apiKey: apiKey?.trim() || undefined,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new EventServiceError(
      errorBody.error || `Failed to process AI chat (Status: ${res.status})`,
      res.status
    );
  }

  return (await res.json()) as ChatRefineResponse;
}
