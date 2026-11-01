import { NextRequest, NextResponse } from "next/server";
import { generateFullEventPlan, callGeminiAPI, EVENT_PLANNER_SYSTEM_PROMPT } from "@/lib/gemini";
import { EventDetails } from "@/lib/types";
import { 
  validateAiRequestPayload, 
  getClientIp, 
  checkRateLimit, 
  sanitizePromptString, 
  validateHttpRequestBody 
} from "@/lib/utils";

// In-Memory IP Rate Limiter (sliding window 60s, max 30 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface AiRequestBody {
  action?: string;
  event?: Partial<EventDetails>;
  message?: string;
  apiKey?: string;
  priorityFocus?: EventDetails['priorityFocus'];
  totalBudget?: number;
  guestCount?: number;
  eventType?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Pre-read Payload Size Header Guard (DoS prevention: max 64KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 65536) {
      return NextResponse.json(
        { error: "Payload too large. Maximum allowed request size is 64KB." },
        { status: 413 }
      );
    }

    // 2. Trusted Client IP derivation (evaluates host edge headers & rightmost proxy hop)
    const ip = getClientIp(req.headers);
    const { allowed, remaining } = checkRateLimit(ip, rateLimitMap, 30, 60000);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before querying the AI engine again." },
        { 
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "30",
            "X-RateLimit-Remaining": "0"
          }
        }
      );
    }

    // 3. Byte-level body reading and verification (guards against missing or spoofed Content-Length)
    const rawText = await req.text().catch(() => null);
    const bodyValidation = validateHttpRequestBody(rawText, 65536);
    if (!bodyValidation.valid) {
      return NextResponse.json(
        { error: bodyValidation.error }, 
        { status: bodyValidation.status || 400 }
      );
    }

    const rawBody = bodyValidation.data as AiRequestBody;

    // 4. Strict request payload schema validation
    const validation = validateAiRequestPayload(rawBody);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { action, event, message, apiKey } = rawBody;

    // Sanitize API key if passed as string
    const sanitizedApiKey = typeof apiKey === "string" ? apiKey.trim() : undefined;

    // Action 1: Generate / Regenerate Full Event Plan
    if (action === "generate_plan") {
      const planResult = await generateFullEventPlan(event as EventDetails, sanitizedApiKey);
      return NextResponse.json(planResult, {
        headers: { "X-RateLimit-Remaining": String(remaining) }
      });
    }

    // Action 2: Chat Refine Assistant in Idea Lab
    if (action === "chat_refine") {
      const safeTitle = sanitizePromptString(event?.title, 100) || "Celebration";
      const safeType = sanitizePromptString(event?.type, 50) || "Event";
      const safeVibe = sanitizePromptString(event?.vibe, 100) || "Festive";
      const safeDietary = sanitizePromptString(event?.culturalDietary, 200) || "General";
      const safeMessage = sanitizePromptString(message, 600);

      const prompt = `
Context: The user is planning a celebration:
- Title: ${safeTitle}
- Type: ${safeType}
- Budget: ${event?.currency || "$"} ${event?.totalBudget || 10000}
- Guest Count: ${event?.guestCount || 50}
- Vibe: ${safeVibe}
- Cultural/Dietary: ${safeDietary}

User Message: "${safeMessage}"

Respond concisely as an elite event stylist and coordinator. If the user is asking to modify or add something (like color palette, icebreakers, run-of-show suggestions, or wording), give concrete actionable ideas with bullet points, mood suggestions, and specific vendor tips.
Keep tone warm, creative, structured, and inspiring.
`;

      const { text, isLive } = await callGeminiAPI(prompt, undefined, sanitizedApiKey);

      if (isLive && text) {
        return NextResponse.json({
          reply: text,
          aiMode: "gemini"
        });
      }

      // Smart responsive fallback reply if Gemini API is not configured or in offline mode
      const lowerMsg = safeMessage.toLowerCase();
      let fallbackReply = `Here is a creative enhancement for your ${safeTitle}:\n\n` +
        `• **Aesthetic Refinement**: Infuse tactile textures like frosted acrylic signage, warm candle groupings, and botanical accents.\n` +
        `• **Guest Experience**: Introduce a themed welcome moment (e.g. customized drink tags or an interactive Polaroid station).\n` +
        `• **Run-of-Show Tip**: Keep speeches capped at 4-5 minutes each right before dinner to maintain vibrant guest energy.\n\n` +
        `Would you like me to draft an updated invitation or adjust your budget sliders to fund this?`;

      if (lowerMsg.includes("budget") || lowerMsg.includes("cost")) {
        fallbackReply = `💡 **Budget Reallocation Tip**: For a ${event?.guestCount || 80}-guest ${safeType}, consider shifting 2-3% from general rentals into catering or entertainment. Catering and music generate 80% of guest sentiment!`;
      } else if (lowerMsg.includes("color") || lowerMsg.includes("theme")) {
        fallbackReply = `🎨 **Color Harmony Suggestion**: Try pairing a grounding deep tone (like Midnight Slate or Espresso Umber) with an organic mid-tone (Tuscan Sage or Dusty Terracotta) and a luminous metallic highlight (Champagne Gold or Rose Foil). This creates depth in photos!`;
      } else if (lowerMsg.includes("game") || lowerMsg.includes("activity")) {
        fallbackReply = `🎲 **Interactive Activity Recommendation**:\n1. **Milestone Trivia / Bingo**: Custom cards on each table featuring fun facts about the guests or honoree.\n2. **Audio Guestbook Lounge**: A quiet corner with a vintage rotary phone where attendees record audio memories.\n3. **Signature Cocktail Vote**: Guests sample two mini mocktail/cocktail shooters and drop a wooden token for their favorite!`;
      }

      return NextResponse.json({
        reply: fallbackReply,
        aiMode: "mock"
      });
    }

    // Action 3: Quick AI Reallocation Recommendation
    if (action === "rebalance_budget") {
      const { priorityFocus, totalBudget, guestCount, eventType } = rawBody;
      const safeEventType = sanitizePromptString(eventType, 50);
      const safePriority = sanitizePromptString(priorityFocus, 50);

      const prompt = `
Given an event with:
- Type: ${safeEventType}
- Total Budget: ${totalBudget}
- Guest Count: ${guestCount}
- Priority Focus: ${safePriority}

Calculate the ideal percentage breakdown across the 6 keys: venue, catering, decor, entertainment, photography, contingency.
Percentages must add up to EXACTLY 100%.

Return strictly JSON:
{
  "allocations": {
    "venue": { "percentage": number, "rationale": string },
    "catering": { "percentage": number, "rationale": string },
    "decor": { "percentage": number, "rationale": string },
    "entertainment": { "percentage": number, "rationale": string },
    "photography": { "percentage": number, "rationale": string },
    "contingency": { "percentage": number, "rationale": string }
  },
  "summaryInsight": string
}
`;

      const { text, isLive } = await callGeminiAPI(prompt, EVENT_PLANNER_SYSTEM_PROMPT, sanitizedApiKey);
      if (isLive && text) {
        try {
          const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(clean);
          return NextResponse.json({ ...parsed, aiMode: "gemini" });
        } catch {
          // Fall through to deterministic fallback if JSON parsing fails
        }
      }

      // High-precision fallback percentages based on target event priority
      const fallbackAllocations = {
        venue: { percentage: 28, rationale: "Secures prime date & core infrastructure" },
        catering: { percentage: 32, rationale: "Generous multi-course hospitality for all guests" },
        decor: { percentage: 14, rationale: "High-impact floral and focal lighting" },
        entertainment: { percentage: 11, rationale: "DJ & sound coordination" },
        photography: { percentage: 10, rationale: "Documentary high-resolution coverage" },
        contingency: { percentage: 5, rationale: "Safe emergency buffer" }
      };

      if (priorityFocus === "food_first") {
        fallbackAllocations.catering = { percentage: 38, rationale: "Top-tier culinary tasting menu and premium bar" };
        fallbackAllocations.venue = { percentage: 25, rationale: "Optimized venue tier with kitchen capabilities" };
        fallbackAllocations.decor = { percentage: 12, rationale: "Minimalist organic tabletop styling" };
      } else if (priorityFocus === "atmosphere") {
        fallbackAllocations.decor = { percentage: 20, rationale: "Statement ceiling florals, mood lighting & lounge furniture" };
        fallbackAllocations.venue = { percentage: 30, rationale: "Aesthetic architectural venue space" };
        fallbackAllocations.entertainment = { percentage: 8, rationale: "Curated sound atmosphere" };
      }

      return NextResponse.json({
        allocations: fallbackAllocations,
        summaryInsight: `Budget recalibrated to emphasize ${safePriority} for ${guestCount} attendees.`,
        aiMode: "mock"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    console.error("API Error in /api/ai:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
