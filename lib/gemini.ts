import { 
  EventDetails, 
  BudgetCategoryKey, 
  CategoryAllocation, 
  TimelineMilestone, 
  DayOfScheduleItem, 
  Vendor, 
  AIIdeaLabData,
  ChatMessage 
} from "./types";
import { CATEGORY_METADATA } from "./mockData";

export interface AIPlanGenerationResult {
  allocations: Record<BudgetCategoryKey, CategoryAllocation>;
  milestones: TimelineMilestone[];
  dayOfSchedule: DayOfScheduleItem[];
  vendors: Vendor[];
  ideaLab: AIIdeaLabData;
  aiMode: 'gemini' | 'mock';
}

/**
 * System Prompt enforcing strict JSON schemas for structured, deterministic outputs
 */
export const EVENT_PLANNER_SYSTEM_PROMPT = `
You are EventVerse Master Generative Architect, an elite world-class event planner and budget strategist.
Your mission is to generate comprehensive, highly realistic, deterministic event blueprints for weddings, milestone birthdays, corporate galas, and community festivals.

CRITICAL RULES:
1. Always output valid, strict JSON ONLY. No markdown wrapper (\`\`\`json), no preamble, no commentary.
2. Ensure budget allocations across the 6 keys ('venue', 'catering', 'decor', 'entertainment', 'photography', 'contingency') total EXACTLY 100%.
3. Make all schedule items, vendor names, and task milestones realistic, localized, and context-aware based on the user's event type, budget, guest count, and vibe.
4. Respect cultural traditions and dietary preferences provided in the inputs.
`;

/**
 * Call Gemini 2.5 Flash / 1.5 Flash via REST API with structured response
 */
export async function callGeminiAPI(
  prompt: string, 
  systemInstruction?: string,
  apiKeyOverride?: string
): Promise<{ text: string; isLive: boolean }> {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
    return { text: "", isLive: false };
  }

  const candidateModels = [
    process.env.NEXT_PUBLIC_GEMINI_MODEL,
    "gemini-3.8-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
  ].filter(Boolean) as string[];

  interface GeminiRequestBody {
    contents: Array<{
      role: string;
      parts: Array<{ text: string }>;
    }>;
    generationConfig: {
      temperature: number;
      topK: number;
      topP: number;
      responseMimeType: string;
    };
    systemInstruction?: {
      parts: Array<{ text: string }>;
    };
  }

  const bodyPayload: GeminiRequestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      topK: 40,
      topP: 0.95,
      responseMimeType: "application/json"
    }
  };

  if (systemInstruction) {
    bodyPayload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  for (const model of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return { text: candidateText, isLive: true };
        }
      } else {
        const errText = await response.text();
        console.warn(`Model ${model} returned ${response.status}: ${errText.substring(0, 100)}... trying next model`);
      }
    } catch (modelErr) {
      console.warn(`Network error with model ${model}:`, modelErr);
    }
  }

  return { text: "", isLive: false };
}

/**
 * Generate full structured event blueprint with Gemini or Smart Fallback
 */
export async function generateFullEventPlan(
  event: EventDetails,
  apiKey?: string
): Promise<AIPlanGenerationResult> {
  const prompt = `
Generate a complete structured celebration blueprint for the following event:
- Title: ${event.title}
- Type: ${event.type}
- Total Budget: ${event.currency} ${event.totalBudget}
- Guest Count: ${event.guestCount}
- Date: ${event.date || 'To be decided'}
- Location: ${event.location || 'Local metropolitan venue'}
- Vibe / Aesthetic: ${event.vibe || 'Modern elegant & celebratory'}
- Cultural / Dietary Considerations: ${event.culturalDietary || 'Standard international with vegetarian options'}
- Priority Focus: ${event.priorityFocus}

Return a JSON object conforming strictly to this structure:
{
  "allocations": {
    "venue": { "percentage": number, "rationale": string },
    "catering": { "percentage": number, "rationale": string },
    "decor": { "percentage": number, "rationale": string },
    "entertainment": { "percentage": number, "rationale": string },
    "photography": { "percentage": number, "rationale": string },
    "contingency": { "percentage": number, "rationale": string }
  },
  "milestones": [
    {
      "id": string,
      "phase": string,
      "timeframe": string,
      "tasks": [
        { "id": string, "title": string, "completed": false, "category": string }
      ]
    }
  ],
  "dayOfSchedule": [
    {
      "id": string,
      "time": string,
      "durationMinutes": number,
      "title": string,
      "category": string,
      "leadPerson": string,
      "notes": string,
      "completed": false
    }
  ],
  "vendors": [
    {
      "id": string,
      "name": string,
      "category": string,
      "contactPerson": string,
      "email": string,
      "phone": string,
      "estimatedCost": number,
      "actualCost": number,
      "status": "Researching" | "Contacted" | "Booked" | "Paid",
      "notes": string,
      "contractSigned": boolean,
      "depositPaid": boolean
    }
  ],
  "ideaLab": {
    "themeConcept": string,
    "themeDescription": string,
    "keyAtmosphereWords": string[],
    "colorPalette": [
      { "name": string, "hex": string, "usage": string }
    ],
    "activities": [
      { "id": string, "title": string, "description": string, "targetGroup": string, "timeframe": string, "tags": string[] }
    ],
    "invitationCopies": [
      { "style": "Formal & Royal" | "Modern & Chic" | "Warm & Whimsical" | "Short & Punchy", "subject": string, "body": string }
    ]
  }
}
`;

  const { text, isLive } = await callGeminiAPI(prompt, EVENT_PLANNER_SYSTEM_PROMPT, apiKey);

  if (isLive && text) {
    try {
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      // Sanitize and attach allocations
      const fullAllocations = {} as Record<BudgetCategoryKey, CategoryAllocation>;
      const keys: BudgetCategoryKey[] = ['venue', 'catering', 'decor', 'entertainment', 'photography', 'contingency'];
      
      keys.forEach(k => {
        const meta = CATEGORY_METADATA[k];
        const pct = parsed.allocations?.[k]?.percentage || meta.defaultPercent;
        fullAllocations[k] = {
          id: k,
          name: meta.name,
          percentage: pct,
          allocatedAmount: Math.round((event.totalBudget * pct) / 100),
          spentAmount: 0,
          iconName: meta.iconName,
          color: meta.color,
          lightBg: meta.lightBg,
          aiSuggestedPercentage: pct,
          rationale: parsed.allocations?.[k]?.rationale || `Optimized allocation for ${event.type}.`
        };
      });

      return {
        allocations: fullAllocations,
        milestones: parsed.milestones || [],
        dayOfSchedule: parsed.dayOfSchedule || [],
        vendors: parsed.vendors || [],
        ideaLab: {
          ...parsed.ideaLab,
          customChatHistory: [
            {
              id: 'init-msg',
              role: 'assistant',
              content: `✨ I have tailored a complete blueprint for **${event.title}**! Theme: *${parsed.ideaLab?.themeConcept || 'Custom Concept'}*. All 4 pillars (Budget, Milestones, Vendors, and Creative Concepts) are synchronized. How can I refine this further?`,
              timestamp: new Date().toISOString()
            }
          ]
        },
        aiMode: 'gemini'
      };
    } catch (parseError) {
      console.warn("Failed to parse Gemini response as JSON, using intelligent mock:", parseError);
    }
  }

  // High-fidelity dynamic fallback generator
  return generateDeterministicSmartPlan(event);
}

/**
 * Intelligent deterministic mock generator when no API key or network is offline
 */
export function generateDeterministicSmartPlan(event: EventDetails): AIPlanGenerationResult {
  const total = event.totalBudget;

  // Custom weight shifts based on priorityFocus
  let percentages: Record<BudgetCategoryKey, number> = {
    venue: 28,
    catering: 32,
    decor: 14,
    entertainment: 11,
    photography: 10,
    contingency: 5
  };

  if (event.priorityFocus === 'food_first') {
    percentages = { venue: 25, catering: 38, decor: 12, entertainment: 10, photography: 10, contingency: 5 };
  } else if (event.priorityFocus === 'atmosphere') {
    percentages = { venue: 30, catering: 28, decor: 18, entertainment: 10, photography: 9, contingency: 5 };
  } else if (event.priorityFocus === 'entertainment') {
    percentages = { venue: 26, catering: 28, decor: 11, entertainment: 18, photography: 12, contingency: 5 };
  } else if (event.priorityFocus === 'memories') {
    percentages = { venue: 26, catering: 30, decor: 12, entertainment: 10, photography: 17, contingency: 5 };
  }

  const fullAllocations = {} as Record<BudgetCategoryKey, CategoryAllocation>;
  const keys: BudgetCategoryKey[] = ['venue', 'catering', 'decor', 'entertainment', 'photography', 'contingency'];
  keys.forEach(k => {
    const meta = CATEGORY_METADATA[k];
    const pct = percentages[k];
    fullAllocations[k] = {
      id: k,
      name: meta.name,
      percentage: pct,
      allocatedAmount: Math.round((total * pct) / 100),
      spentAmount: 0,
      iconName: meta.iconName,
      color: meta.color,
      lightBg: meta.lightBg,
      aiSuggestedPercentage: pct,
      rationale: `AI adjusted to ${pct}% based on ${event.priorityFocus} priority and ${event.guestCount} guests.`
    };
  });

  // Tailored milestones based on event type
  const isWedding = event.type === 'wedding';
  const isCorporate = event.type === 'corporate';

  const milestones: TimelineMilestone[] = [
    {
      id: "m-gen-1",
      phase: "Phase 1: Concept & Core Reservations",
      timeframe: isWedding ? "9 - 12 Months Out" : "3 - 6 Months Out",
      tasks: [
        { id: "tg-1", title: `Lock in premier ${event.type} venue and date contract`, completed: true, category: "venue" },
        { id: "tg-2", title: `Finalize budget ceiling of ${event.currency} ${event.totalBudget.toLocaleString()} & guest estimate`, completed: true, category: "general" },
        { id: "tg-3", title: `Interview lead ${event.type === 'corporate' ? 'event producer' : 'day-of coordinator'}`, completed: false, category: "general" },
        { id: "tg-4", title: "Reserve top-choice photographer & videography team", completed: false, category: "photography" }
      ]
    },
    {
      id: "m-gen-2",
      phase: "Phase 2: Experience & Sensory Design",
      timeframe: isWedding ? "4 - 6 Months Out" : "6 - 8 Weeks Out",
      tasks: [
        { id: "tg-5", title: `Catering menu tastings respecting: ${event.culturalDietary || 'dietary preferences'}`, completed: false, category: "catering" },
        { id: "tg-6", title: `Design visual moodboard & floral color palette (${event.vibe || 'signature look'})`, completed: false, category: "decor" },
        { id: "tg-7", title: "Audition live musical performers, DJ, or keynote sound team", completed: false, category: "entertainment" },
        { id: "tg-8", title: "Dispatch digital and physical invitations with RSVP portal", completed: false, category: "general" }
      ]
    },
    {
      id: "m-gen-3",
      phase: "Phase 3: Final Production & Day-Of Prep",
      timeframe: "1 - 2 Weeks Out",
      tasks: [
        { id: "tg-9", title: "Final headcount submission to catering & venue manager", completed: false, category: "catering" },
        { id: "tg-10", title: "Generate detailed Day-of Run-of-Show for all coordinators", completed: false, category: "general" },
        { id: "tg-11", title: "Final technical AV soundcheck and lighting rehearsal", completed: false, category: "entertainment" }
      ]
    }
  ];

  // Tailored Day of Schedule
  const dayOfSchedule: DayOfScheduleItem[] = [
    {
      id: "dos-g1",
      time: "08:30 AM",
      durationMinutes: 90,
      title: "Vendor Site Load-in & Power Checks",
      category: "Logistics",
      leadPerson: "Lead Coordinator",
      notes: "Verify loading dock access and safety clearance.",
      completed: true
    },
    {
      id: "dos-g2",
      time: "10:30 AM",
      durationMinutes: 60,
      title: "Floral & Decor Installations",
      category: "Decor",
      leadPerson: "Lead Designer",
      notes: "Set up centerpiece tables, signage, and entrance arch.",
      completed: false
    },
    {
      id: "dos-g3",
      time: "01:00 PM",
      durationMinutes: 60,
      title: "Technical Soundcheck & Microphones",
      category: "AV",
      leadPerson: "Audio Engineer",
      notes: "Test wireless lapels, keynote podium, and background playlists.",
      completed: false
    },
    {
      id: "dos-g4",
      time: "04:30 PM",
      durationMinutes: 45,
      title: "Guest Arrival & Welcome Refreshments",
      category: "Hospitality",
      leadPerson: "Host & Welcoming Staff",
      notes: "Signature welcome drinks and ambient background music.",
      completed: false
    },
    {
      id: "dos-g5",
      time: "05:30 PM",
      durationMinutes: 60,
      title: isWedding ? "Main Ceremony & Vows" : isCorporate ? "Opening Keynotes & Leadership Address" : "Celebration Opening & Birthday Toast",
      category: "Main Program",
      leadPerson: "Master of Ceremonies",
      notes: "Capture key milestones on dual camera angles.",
      completed: false
    },
    {
      id: "dos-g6",
      time: "07:00 PM",
      durationMinutes: 90,
      title: "Dinner Service & Curated Dining Experience",
      category: "Dining",
      leadPerson: "Executive Chef & Banquet Captain",
      notes: "Special dietary dishes served directly to designated tables.",
      completed: false
    },
    {
      id: "dos-g7",
      time: "08:45 PM",
      durationMinutes: 120,
      title: "Celebration, Dancing & Interactive Experiences",
      category: "Entertainment",
      leadPerson: "DJ / Entertainment Director",
      notes: "Highlight speeches, interactive activities, and open dance floor.",
      completed: false
    }
  ];

  // Tailored Vendors
  const vendors: Vendor[] = [
    {
      id: "vg-1",
      name: `${event.title} Primary Venue`,
      category: "venue",
      contactPerson: "Jordan Hayes",
      email: "reservations@grandvenues.com",
      phone: "+1 (555) 234-5678",
      estimatedCost: Math.round(total * (percentages.venue / 100)),
      actualCost: Math.round(total * (percentages.venue / 100)),
      status: "Booked",
      notes: "Site visit completed; includes 10-hour rental and security.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "vg-2",
      name: "Epicurean Harmony Catering",
      category: "catering",
      contactPerson: "Chef Maria Santos",
      email: "maria@epicurean-catering.com",
      phone: "+1 (555) 345-6789",
      estimatedCost: Math.round(total * (percentages.catering / 100)),
      actualCost: 0,
      status: "Contacted",
      notes: `Custom menu proposal tailored for ${event.guestCount} guests with ${event.culturalDietary || 'dietary tags'}.`,
      contractSigned: false,
      depositPaid: false
    },
    {
      id: "vg-3",
      name: "Lumina Artistry & Flora",
      category: "decor",
      contactPerson: "Sora Kim",
      email: "sora@luminadecor.design",
      phone: "+1 (555) 456-7890",
      estimatedCost: Math.round(total * (percentages.decor / 100)),
      actualCost: 0,
      status: "Researching",
      notes: `Moodboard inspired by: ${event.vibe || 'modern celebration'}.`,
      contractSigned: false,
      depositPaid: false
    },
    {
      id: "vg-4",
      name: "Acoustic & Electric Audio Production",
      category: "entertainment",
      contactPerson: "Marcus Vance",
      email: "marcus@soundvance.io",
      phone: "+1 (555) 567-8901",
      estimatedCost: Math.round(total * (percentages.entertainment / 100)),
      actualCost: 0,
      status: "Researching",
      notes: "Full sound system, intelligent lighting, and professional DJ/MC.",
      contractSigned: false,
      depositPaid: false
    },
    {
      id: "vg-5",
      name: "Solstice Visual Storytellers",
      category: "photography",
      contactPerson: "Chloe Bennett",
      email: "chloe@solsticestories.com",
      phone: "+1 (555) 678-9012",
      estimatedCost: Math.round(total * (percentages.photography / 100)),
      actualCost: 0,
      status: "Contacted",
      notes: "8 hours multi-angle coverage with online high-res delivery.",
      contractSigned: false,
      depositPaid: false
    }
  ];

  // Idea Lab data
  const ideaLab: AIIdeaLabData = {
    themeConcept: `${event.vibe || 'Luminous Elegance'}: A Bespoke Celebration`,
    themeDescription: `A thoughtfully orchestrated experience for ${event.title}. Blending atmospheric warmth, personalized touches reflecting your cultural background, and engaging interactive moments for all ${event.guestCount} guests.`,
    keyAtmosphereWords: ["Celebratory", "Curated", "Memorable", "Engaging", "Seamless"],
    colorPalette: [
      { name: "Celestial Gold", hex: "#D4AF37", usage: "Accents, signage borders, and ambient lighting" },
      { name: "Deep Velvet Navy", hex: "#0F1E36", usage: "Foundation draping, stationery, and linens" },
      { name: "Warm Alabaster", hex: "#FDFBF7", usage: "Table surfaces, florals, and invitation backgrounds" },
      { name: "Earthy Sage", hex: "#7D8C7C", usage: "Botanical arrangements and nature accents" },
      { name: "Soft Blush Champagne", hex: "#E8D3C6", usage: "Lighting washes, menu accents, and delicate ribbons" }
    ],
    activities: [
      {
        id: "act-g1",
        title: "The Golden Memory Vault & Voice Messages",
        description: "An interactive audio recording station where guests record spontaneous memories and well-wishes for the celebration.",
        targetGroup: "All Attendees",
        timeframe: "Throughout Cocktail Hour",
        tags: ["Interactive", "Sentimental", "Keepsake"]
      },
      {
        id: "act-g2",
        title: "Signature Sip & Story Cocktail Tasting",
        description: "Two custom cocktails (plus artisanal zero-proof mocktails) named after meaningful milestones in your journey.",
        targetGroup: "Socializing Guests",
        timeframe: "Reception",
        tags: ["Culinary", "Bespoke", "Fun"]
      },
      {
        id: "act-g3",
        title: "Live Polaroid Memory Wall",
        description: "Guests snap instant photos, sign them with metallic pens, and hang them on a fairy-lit wire grid wall.",
        targetGroup: "All Guests",
        timeframe: "Evening",
        tags: ["Photo", "Interactive", "Keepsake"]
      }
    ],
    invitationCopies: [
      {
        style: "Formal & Royal",
        subject: `Honoured Invitation: ${event.title}`,
        body: `It is with great pleasure that you are cordially invited to celebrate ${event.title}. Join us for an extraordinary evening of fellowship, fine dining, and joyous memories.`
      },
      {
        style: "Modern & Chic",
        subject: `Join Us: ${event.title}`,
        body: `We are celebrating in style! Come enjoy great cocktails, memorable music, and an unforgettable celebration. RSVP to secure your spot.`
      },
      {
        style: "Warm & Whimsical",
        subject: `A Special Celebration: ${event.title}`,
        body: `Moments are made sweeter when shared with the ones who matter most. We cannot wait to raise a glass and celebrate this milestone together.`
      },
      {
        style: "Short & Punchy",
        subject: `Save the Date: ${event.title}`,
        body: `${event.title} is happening! Save the date for great food, memorable laughs, and an epic celebration.`
      }
    ],
    customChatHistory: [
      {
        id: "init-smart",
        role: "assistant",
        content: `🎉 I have created a personalized blueprint for **${event.title}** tailored for **${event.guestCount} guests** and a **${event.currency} ${event.totalBudget.toLocaleString()}** budget. Explore the interactive tabs above or ask me any question below!`,
        timestamp: new Date().toISOString()
      }
    ]
  };

  return {
    allocations: fullAllocations,
    milestones,
    dayOfSchedule,
    vendors,
    ideaLab,
    aiMode: 'mock'
  };
}
