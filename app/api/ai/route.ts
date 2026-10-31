import { NextRequest, NextResponse } from "next/server";
import { generateFullEventPlan, callGeminiAPI, EVENT_PLANNER_SYSTEM_PROMPT } from "@/lib/gemini";
import { EventDetails } from "@/lib/types";
import { validateAiRequestPayload } from "@/lib/utils";

// In-Memory IP Rate Limiter (sliding window 60s, max 30 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 30;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, remaining: maxRequests - current.count };
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP-based Rate Limiting check
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = (forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip")) || "127.0.0.1";
    const { allowed, remaining } = checkRateLimit(ip);

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

    // 2. Body parsing and strict schema validation
    const body = await req.json().catch(() => null);
    const validation = validateAiRequestPayload(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { action, event, message, chatHistory, apiKey } = body;

    // Sanitize API key if passed as string
    const sanitizedApiKey = typeof apiKey === "string" ? apiKey.trim() : undefined;

    // 1. Generate / Regenerate Full Event Plan
    if (action === "generate_plan") {
      const planResult = await generateFullEventPlan(event as EventDetails, sanitizedApiKey);
      return NextResponse.json(planResult, {
        headers: { "X-RateLimit-Remaining": String(remaining) }
      });
    }

    // 2. Chat Refine Assistant in Idea Lab
    if (action === "chat_refine") {
      const prompt = `
Context: The user is planning a celebration:
- Title: ${event?.title || 'Celebration'}
- Type: ${event?.type || 'Event'}
- Budget: ${event?.currency || '$'} ${event?.totalBudget || 10000}
- Guest Count: ${event?.guestCount || 50}
- Vibe: ${event?.vibe || 'Festive'}
- Cultural/Dietary: ${event?.culturalDietary || 'General'}

User Message: "${message}"

Respond concisely as an elite event stylist and coordinator. If the user is asking to modify or add something (like color palette, icebreakers, run-of-show suggestions, or wording), give concrete actionable ideas with bullet points, mood suggestions, and specific vendor tips.
Keep tone warm, creative, structured, and inspiring.
`;

      const { text, isLive } = await callGeminiAPI(prompt, undefined, sanitizedApiKey);

      if (isLive && text) {
        return NextResponse.json({
          reply: text,
          aiMode: 'gemini'
        });
      }

      // Smart responsive fallback reply if Gemini API is not configured
      let fallbackReply = `Here is a creative enhancement for your ${event?.title || 'event'}:\n\n` +
        `• **Aesthetic Refinement**: Infuse tactile textures like frosted acrylic signage, warm candle groupings, and botanical accents.\n` +
        `• **Guest Experience**: Introduce a themed welcome moment (e.g. customized drink tags or an interactive Polaroid station).\n` +
        `• **Run-of-Show Tip**: Keep speeches capped at 4-5 minutes each right before dinner to maintain vibrant guest energy.\n\n` +
        `Would you like me to draft an updated invitation or adjust your budget sliders to fund this?`;

      if (message.toLowerCase().includes("budget") || message.toLowerCase().includes("cost")) {
        fallbackReply = `💡 **Budget Reallocation Tip**: For a ${event?.guestCount || 80}-guest ${event?.type || 'event'}, consider shifting 2-3% from general rentals into catering or entertainment. Catering and music generate 80% of guest sentiment!`;
      } else if (message.toLowerCase().includes("color") || message.toLowerCase().includes("theme")) {
        fallbackReply = `🎨 **Color Harmony Suggestion**: Try pairing a grounding deep tone (like Midnight Slate or Espresso Umber) with an organic mid-tone (Tuscan Sage or Dusty Terracotta) and a luminous metallic highlight (Champagne Gold or Rose Foil). This creates depth in photos!`;
      } else if (message.toLowerCase().includes("game") || message.toLowerCase().includes("activity")) {
        fallbackReply = `🎲 **Interactive Activity Recommendation**:\n1. **Milestone Trivia / Bingo**: Custom cards on each table featuring fun facts about the guests or honoree.\n2. **Audio Guestbook Lounge**: A quiet corner with a vintage rotary phone where attendees record audio memories.\n3. **Signature Cocktail Vote**: Guests sample two mini mocktail/cocktail shooters and drop a wooden token for their favorite!`;
      }

      return NextResponse.json({
        reply: fallbackReply,
        aiMode: 'mock'
      });
    }

    // 3. Quick AI Reallocation Recommendation
    if (action === "rebalance_budget") {
      const { priorityFocus, totalBudget, guestCount, eventType } = body;
      const prompt = `
Given an event with:
- Type: ${eventType}
- Total Budget: ${totalBudget}
- Guest Count: ${guestCount}
- Priority Focus: ${priorityFocus}

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
          return NextResponse.json({ ...parsed, aiMode: 'gemini' });
        } catch (e) {
          // fallback
        }
      }

      // Fallback percentages
      let fallbackAllocations = {
        venue: { percentage: 28, rationale: "Secures prime date & core infrastructure" },
        catering: { percentage: 32, rationale: "Generous multi-course hospitality for all guests" },
        decor: { percentage: 14, rationale: "High-impact floral and focal lighting" },
        entertainment: { percentage: 11, rationale: "DJ & sound coordination" },
        photography: { percentage: 10, rationale: "Documentary high-resolution coverage" },
        contingency: { percentage: 5, rationale: "Safe emergency buffer" }
      };

      if (priorityFocus === 'food_first') {
        fallbackAllocations.catering = { percentage: 38, rationale: "Top-tier culinary tasting menu and premium bar" };
        fallbackAllocations.venue = { percentage: 25, rationale: "Optimized venue tier with kitchen capabilities" };
        fallbackAllocations.decor = { percentage: 12, rationale: "Minimalist organic tabletop styling" };
      } else if (priorityFocus === 'atmosphere') {
        fallbackAllocations.decor = { percentage: 20, rationale: "Statement ceiling florals, mood lighting & lounge furniture" };
        fallbackAllocations.venue = { percentage: 30, rationale: "Aesthetic architectural venue space" };
        fallbackAllocations.entertainment = { percentage: 8, rationale: "Curated sound atmosphere" };
      }

      return NextResponse.json({
        allocations: fallbackAllocations,
        summaryInsight: `Budget recalibrated to emphasize ${priorityFocus} for ${guestCount} attendees.`,
        aiMode: 'mock'
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("API Error in /api/ai:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
