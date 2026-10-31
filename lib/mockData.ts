import { EventVerseState, EventType, BudgetCategoryKey, CategoryAllocation } from "./types";

export const CATEGORY_METADATA: Record<BudgetCategoryKey, {
  name: string;
  defaultPercent: number;
  iconName: string;
  color: string;
  lightBg: string;
  description: string;
}> = {
  venue: {
    name: "Venue & Rentals",
    defaultPercent: 28,
    iconName: "Building2",
    color: "#8B5CF6", // neon violet
    lightBg: "bg-purple-950/40 text-purple-300 border-purple-500/40",
    description: "Location fee, tables, chairs, lighting, restrooms, and security."
  },
  catering: {
    name: "Catering & Bar",
    defaultPercent: 32,
    iconName: "Utensils",
    color: "#00F0FF", // neon cyan
    lightBg: "bg-cyan-950/40 text-cyan-300 border-cyan-500/40",
    description: "Appetizers, main dinner, specialty drinks, cake/dessert, and bar staffing."
  },
  decor: {
    name: "Decor & Florals",
    defaultPercent: 14,
    iconName: "Sparkles",
    color: "#FF007F", // neon pink
    lightBg: "bg-pink-950/40 text-pink-300 border-pink-500/40",
    description: "Centerpieces, backdrop installations, ceremonial arch, signage, table linens."
  },
  entertainment: {
    name: "Entertainment & AV",
    defaultPercent: 11,
    iconName: "Music",
    color: "#38BDF8", // neon sky blue
    lightBg: "bg-sky-950/40 text-sky-300 border-sky-500/40",
    description: "DJ / Live band, sound engineers, microphones, dance floor lighting, MC."
  },
  photography: {
    name: "Photo & Video",
    defaultPercent: 10,
    iconName: "Camera",
    color: "#A855F7", // neon electric purple
    lightBg: "bg-purple-950/40 text-purple-300 border-purple-500/40",
    description: "Lead photographer, drone footage, highlight reel, and digital master gallery."
  },
  contingency: {
    name: "Contingency Fund",
    defaultPercent: 5,
    iconName: "ShieldAlert",
    color: "#00FF9D", // neon emerald
    lightBg: "bg-emerald-950/40 text-emerald-300 border-emerald-500/40",
    description: "Buffer for unexpected overtime, weather adjustments, or last-minute supplies."
  }
};

export function buildCategoryAllocations(
  totalBudget: number,
  customPercentages?: Partial<Record<BudgetCategoryKey, number>>
): Record<BudgetCategoryKey, CategoryAllocation> {
  const keys: BudgetCategoryKey[] = ['venue', 'catering', 'decor', 'entertainment', 'photography', 'contingency'];
  const allocations: Partial<Record<BudgetCategoryKey, CategoryAllocation>> = {};

  keys.forEach(k => {
    const meta = CATEGORY_METADATA[k];
    const percentage = customPercentages?.[k] ?? meta.defaultPercent;
    const allocatedAmount = Math.round((totalBudget * percentage) / 100);

    allocations[k] = {
      id: k,
      name: meta.name,
      percentage,
      allocatedAmount,
      spentAmount: 0,
      iconName: meta.iconName,
      color: meta.color,
      lightBg: meta.lightBg,
      aiSuggestedPercentage: meta.defaultPercent,
      rationale: `Standard industry allocation of ${percentage}% optimized for overall guest satisfaction.`
    };
  });

  return allocations as Record<BudgetCategoryKey, CategoryAllocation>;
}

export const TEMPLATE_WEDDING: EventVerseState = {
  version: "1.0",
  lastUpdated: new Date().toISOString(),
  isAiGenerating: false,
  aiMode: "mock",
  event: {
    id: "template-wedding-01",
    title: "Amara & Julian's Sunset Vineyard Wedding",
    type: "wedding",
    totalBudget: 42000,
    currency: "USD",
    guestCount: 130,
    date: "2026-09-18",
    location: "Napa Valley, California",
    vibe: "Earthy luxury, warm bohemian sunset, acoustic intimacy & fairy-lit dancing",
    culturalDietary: "Gluten-free wedding cake, Mediterranean vegan-friendly spread, Italian wine pairing",
    priorityFocus: "food_first"
  },
  budgetAllocations: {
    venue: {
      id: "venue",
      name: "Venue & Rentals",
      percentage: 27,
      allocatedAmount: 11340,
      spentAmount: 11000,
      iconName: "Building2",
      color: "#6366f1",
      lightBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      aiSuggestedPercentage: 27,
      rationale: "Historic winery reservation covering ceremony lawn, barrel room cocktail hour & dining veranda."
    },
    catering: {
      id: "catering",
      name: "Catering & Bar",
      percentage: 33,
      allocatedAmount: 13860,
      spentAmount: 12500,
      iconName: "Utensils",
      color: "#00F0FF",
      lightBg: "bg-purple-950/40 text-neon-purple border-purple-800",
      aiSuggestedPercentage: 34,
      rationale: "Farm-to-table 3-course plated dinner plus artisanal wood-fired late night pizza."
    },
    decor: {
      id: "decor",
      name: "Decor & Florals",
      percentage: 15,
      allocatedAmount: 6300,
      spentAmount: 5800,
      iconName: "Sparkles",
      color: "#ec4899",
      lightBg: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800",
      aiSuggestedPercentage: 14,
      rationale: "Dried pampas grass, terracotta urns, hanging Edison bulbs, eucalyptus runners."
    },
    entertainment: {
      id: "entertainment",
      name: "Entertainment & AV",
      percentage: 10,
      allocatedAmount: 4200,
      spentAmount: 3800,
      iconName: "Music",
      color: "#8b5cf6",
      lightBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      aiSuggestedPercentage: 10,
      rationale: "Acoustic duo for ceremony and cocktail hour; high-energy DJ for after-party."
    },
    photography: {
      id: "photography",
      name: "Photo & Video",
      percentage: 10,
      allocatedAmount: 4200,
      spentAmount: 4200,
      iconName: "Camera",
      color: "#06b6d4",
      lightBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
      aiSuggestedPercentage: 10,
      rationale: "8 hours dual-shooter documentary photography, aerial drone clips, and edited highlights reel."
    },
    contingency: {
      id: "contingency",
      name: "Contingency Fund",
      percentage: 5,
      allocatedAmount: 2100,
      spentAmount: 400,
      iconName: "ShieldAlert",
      color: "#10b981",
      lightBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      aiSuggestedPercentage: 5,
      rationale: "Reserved for unexpected weather tenting or last-minute shuttle extensions."
    }
  },
  milestones: [
    {
      id: "m-1",
      phase: "Phase 1: Foundations",
      timeframe: "9 - 12 Months Out",
      tasks: [
        { id: "t-1", title: "Lock in Estate Vineyard Venue & Deposit", completed: true, category: "venue" },
        { id: "t-2", title: "Finalize VIP Guest Count & Budget Ceiling", completed: true, category: "general" },
        { id: "t-3", title: "Hire Lead Wedding Planner & Day-of Coordinator", completed: true, category: "general" },
        { id: "t-4", title: "Interview & Book Documentary Photographer", completed: true, category: "photography" }
      ]
    },
    {
      id: "m-2",
      phase: "Phase 2: Sensory & Design",
      timeframe: "6 - 8 Months Out",
      tasks: [
        { id: "t-5", title: "Catering Menu & Wine Pairing Tasting Session", completed: true, category: "catering" },
        { id: "t-6", title: "Floral Mockups: Arch, Bouquets & Terracotta Urns", completed: false, category: "decor" },
        { id: "t-7", title: "Design & Mail Save-the-Dates", completed: true, category: "general" },
        { id: "t-8", title: "Book Ceremony Acoustic Duo & Reception DJ", completed: false, category: "entertainment" }
      ]
    },
    {
      id: "m-3",
      phase: "Phase 3: Logistics & Precision",
      timeframe: "2 - 3 Months Out",
      tasks: [
        { id: "t-9", title: "Send Formal Digital & Foil Printed Invitations", completed: false, category: "general" },
        { id: "t-10", title: "Finalize Dietary Dietary Tags & Seating Chart", completed: false, category: "catering" },
        { id: "t-11", title: "Confirm Shuttle Buses from Downtown Hotels", completed: false, category: "general" }
      ]
    },
    {
      id: "m-4",
      phase: "Phase 4: Final Polish",
      timeframe: "1 - 2 Weeks Out",
      tasks: [
        { id: "t-12", title: "Conduct Final Venue Walkthrough with Coordinator", completed: false, category: "venue" },
        { id: "t-13", title: "Distribute Day-of Run of Show to Wedding Party", completed: false, category: "general" },
        { id: "t-14", title: "Prepare Final Gratuity Envelopes for Vendors", completed: false, category: "general" }
      ]
    }
  ],
  dayOfSchedule: [
    {
      id: "dos-1",
      time: "09:30 AM",
      durationMinutes: 90,
      title: "Bridal Suite Hair & Makeup Glam Session",
      category: "Preparation",
      leadPerson: "Lead Stylist (Chloe)",
      notes: "Mimosa bar & fruit skewers in suite.",
      completed: true
    },
    {
      id: "dos-2",
      time: "11:30 AM",
      durationMinutes: 60,
      title: "Vendor Load-in & Floral Arch Installation",
      category: "Logistics",
      leadPerson: "Florist (Bloomcraft)",
      notes: "Check arbor stability against breeze.",
      completed: true
    },
    {
      id: "dos-3",
      time: "01:30 PM",
      durationMinutes: 60,
      title: "First Look & Private Couple Portraits",
      category: "Photography",
      leadPerson: "Lead Photographer (Lena)",
      notes: "Vineyard overlook olive grove.",
      completed: false
    },
    {
      id: "dos-4",
      time: "03:30 PM",
      durationMinutes: 45,
      title: "Guest Arrival & Welcome Spritzers",
      category: "Hospitality",
      leadPerson: "Venue Captain (Marco)",
      notes: "Acoustic duo begins ambient chords.",
      completed: false
    },
    {
      id: "dos-5",
      time: "04:30 PM",
      durationMinutes: 40,
      title: "Ceremony & Vows Under the Oaks",
      category: "Ceremony",
      leadPerson: "Officiant & Couple",
      notes: "No flash photography during readings.",
      completed: false
    },
    {
      id: "dos-6",
      time: "05:15 PM",
      durationMinutes: 75,
      title: "Golden Hour Cocktail Hour & Charcuterie",
      category: "Cocktails",
      leadPerson: "Catering Lead",
      notes: "Passed crostini & Pinot Noir reserve.",
      completed: false
    },
    {
      id: "dos-7",
      time: "06:45 PM",
      durationMinutes: 90,
      title: "Grand Entrance & 3-Course Sunset Dinner",
      category: "Dinner",
      leadPerson: "MC / DJ",
      notes: "Speeches between 1st & 2nd courses.",
      completed: false
    },
    {
      id: "dos-8",
      time: "08:30 PM",
      durationMinutes: 180,
      title: "First Dance, Cake Cutting & Night Dance Party",
      category: "Party",
      leadPerson: "DJ Nova",
      notes: "Sparkler send-off at 11:15 PM.",
      completed: false
    }
  ],
  vendors: [
    {
      id: "v-1",
      name: "Meadowood Estate & Vineyards",
      category: "venue",
      contactPerson: "Elena Vance",
      email: "events@meadowoodestate.com",
      phone: "+1 (707) 555-0192",
      estimatedCost: 11000,
      actualCost: 11000,
      status: "Paid",
      notes: "Includes bridal dressing suite and 140 wooden crossback chairs.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "v-2",
      name: "Heirloom Harvest Catering",
      category: "catering",
      contactPerson: "Chef Antoine",
      email: "hello@heirloomharvest.co",
      phone: "+1 (707) 555-3849",
      estimatedCost: 13500,
      actualCost: 12500,
      status: "Booked",
      notes: "Plated duck breast & wild mushroom risotto. Halal and GF accommodated.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "v-3",
      name: "Wildflower & Thistle Botanicals",
      category: "decor",
      contactPerson: "Tara Lin",
      email: "tara@wildflowernapa.com",
      phone: "+1 (415) 555-9201",
      estimatedCost: 6000,
      actualCost: 5800,
      status: "Contacted",
      notes: "Waiting on sample mockups for table garlands and chandelier greenery.",
      contractSigned: false,
      depositPaid: false
    },
    {
      id: "v-4",
      name: "Aura Cinematic Photography",
      category: "photography",
      contactPerson: "Marcus Cole",
      email: "marcus@auracinema.photo",
      phone: "+1 (415) 555-8320",
      estimatedCost: 4200,
      actualCost: 4200,
      status: "Booked",
      notes: "Deposit of $1,500 transferred. Remaining due 7 days prior.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "v-5",
      name: "Velvet Groove Band & DJ Collective",
      category: "entertainment",
      contactPerson: "Leo Sterling",
      email: "booking@velvetgroove.live",
      phone: "+1 (415) 555-4011",
      estimatedCost: 4000,
      actualCost: 3800,
      status: "Researching",
      notes: "Comparing acoustic quartet quote vs 6-piece Motown ensemble.",
      contractSigned: false,
      depositPaid: false
    }
  ],
  ideaLab: {
    themeConcept: "Terra & Twilight: Warm Tuscan-Bohemian Romance",
    themeDescription: "A curated aesthetic blending organic earthiness with understated California luxury. Unfinished linen runners, raw clay vessels, warm sunset amber hues, and abundant olive branch foliage illuminated by hundreds of floating pillar candles.",
    keyAtmosphereWords: ["Intimate", "Warm Sunlight", "Organic Luxury", "Fairy-Lit", "Unrushed"],
    colorPalette: [
      { name: "Terracotta Sunset", hex: "#C86D51", usage: "Primary accent for menus, clay pottery, and bridesmaid shawls" },
      { name: "Tuscan Olive", hex: "#556B2F", usage: "Foliage garlands, eucalyptus boughs, and stationery ribbons" },
      { name: "Champagne Velvet", hex: "#F3E5AB", usage: "Draped canopy fabrics, table runners, and candlelight reflection" },
      { name: "Raw Ochre", hex: "#CC7722", usage: "Wax seal stamps, cocktail garnishes, and vintage signage" },
      { name: "Espresso Umber", hex: "#3B2F2F", usage: "Typography contrast, wooden seating, and rustic barrel details" }
    ],
    activities: [
      {
        id: "act-1",
        title: "Bespoke Perfumery / Essential Oil Blending Station",
        description: "Guests create a miniature keepsake roller perfume with lavender, sandalwood, and sweet orange matching the wedding scent profile.",
        targetGroup: "All Guests",
        timeframe: "During Cocktail Hour",
        tags: ["Experiential", "Keepsake", "Sensory"]
      },
      {
        id: "act-2",
        title: "Audio Guestbook Rotary Phone",
        description: "A vintage 1950s telephone where guests lift the receiver to hear a couple greeting, then record heartfelt, spontaneous advice.",
        targetGroup: "All Attendees",
        timeframe: "All Evening",
        tags: ["Interactive", "Memory-Making", "Novelty"]
      },
      {
        id: "act-3",
        title: "Late-Night Gelato & Espresso Cart",
        description: "Surprise mobile cart rolling out at 10 PM serving hazelnut crunch gelato affogatos to recharge dancers.",
        targetGroup: "Dance Crowd",
        timeframe: "Late Night (10:00 PM)",
        tags: ["Culinary", "Energy", "Delight"]
      }
    ],
    invitationCopies: [
      {
        style: "Formal & Royal",
        subject: "The Wedding Celebration of Amara & Julian",
        body: "Together with their families, Amara Sterling and Julian Hayes request the honour of your presence as they exchange vows under the twilight canopy of Meadowood Estate. Dinner, dancing, and fine wine to follow."
      },
      {
        style: "Modern & Chic",
        subject: "Amara + Julian are getting married!",
        body: "Join us for golden hour vows, honest laughter, good wine, and an unforgettable evening under the Napa stars. September 18th, 2026. Bring your dancing shoes."
      },
      {
        style: "Warm & Whimsical",
        subject: "Love, Wine & Wildflowers: Celebrate with Us",
        body: "Two lives, one shared journey. We could not imagine stepping into forever without our dearest circle. Come celebrate our wedding with heartfelt vows, great music, and memories to last a lifetime."
      },
      {
        style: "Short & Punchy",
        subject: "Save the Date: Amara & Julian",
        body: "September 18, 2026. Napa Valley. Great food, flowing drinks, and two people in love. RSVP by July 1st."
      }
    ],
    customChatHistory: [
      {
        id: "c-1",
        role: "assistant",
        content: "Welcome to EventVerse AI Idea Lab! I have prepared your Terra & Twilight concept with tailored Tuscan colors, interactive sensory booths, and custom invitation wording. What would you like to refine next?",
        timestamp: new Date().toISOString()
      }
    ]
  },
  tables: [
    {
      id: "tbl-1",
      number: 1,
      name: "VIP Head Table",
      capacity: 8,
      guests: [
        { id: "g-1", name: "Amara & Julian (Couple)", dietary: "Regular" },
        { id: "g-2", name: "Guest of Honor", dietary: "Gluten-Free" },
        { id: "g-3", name: "Maid of Honor", dietary: "Vegan" },
        { id: "g-4", name: "Best Man", dietary: "Regular" }
      ]
    },
    {
      id: "tbl-2",
      number: 2,
      name: "Family & Elders Circle",
      capacity: 10,
      guests: [
        { id: "g-5", name: "Grandparents", dietary: "Vegetarian" },
        { id: "g-6", name: "Aunt Maya", dietary: "Jain" },
        { id: "g-7", name: "Uncle David", dietary: "Regular" },
        { id: "g-8", name: "Cousin Nina", dietary: "Vegan" }
      ]
    },
    {
      id: "tbl-3",
      number: 3,
      name: "Tech Visionaries & Mentors",
      capacity: 8,
      guests: [
        { id: "g-9", name: "Dr. Elena Vance", dietary: "Halal" },
        { id: "g-10", name: "Lead Systems Architect", dietary: "Regular" },
        { id: "g-11", name: "Design Director", dietary: "Gluten-Free" }
      ]
    },
    {
      id: "tbl-4",
      number: 4,
      name: "College Friends & Dancers",
      capacity: 10,
      guests: [
        { id: "g-12", name: "Alex K.", dietary: "Regular" },
        { id: "g-13", name: "Samira R.", dietary: "Vegetarian" },
        { id: "g-14", name: "Marcus B.", dietary: "Regular" },
        { id: "g-15", name: "Chloe T.", dietary: "Vegan" }
      ]
    }
  ]
};

export const TEMPLATE_BIRTHDAY: EventVerseState = {
  version: "1.0",
  lastUpdated: new Date().toISOString(),
  isAiGenerating: false,
  aiMode: "mock",
  event: {
    id: "template-bday-02",
    title: "Leo's Neon Horizon 30th Rooftop Gala",
    type: "birthday",
    totalBudget: 11000,
    currency: "USD",
    guestCount: 65,
    date: "2026-11-14",
    location: "Skyline Loft Rooftop, Austin TX",
    vibe: "Futuristic neon, cyberpunk chic, synthwave beats & craft mixology",
    culturalDietary: "Keto & Vegan sliders, mocktail bar station, dairy-free dessert shooters",
    priorityFocus: "entertainment"
  },
  budgetAllocations: {
    venue: {
      id: "venue",
      name: "Venue & Rentals",
      percentage: 30,
      allocatedAmount: 3300,
      spentAmount: 3300,
      iconName: "Building2",
      color: "#6366f1",
      lightBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      aiSuggestedPercentage: 30,
      rationale: "Panoramic skyline deck rental with LED illuminated high-top tables."
    },
    catering: {
      id: "catering",
      name: "Catering & Bar",
      percentage: 28,
      allocatedAmount: 3080,
      spentAmount: 2800,
      iconName: "Utensils",
      color: "#00F0FF",
      lightBg: "bg-purple-950/40 text-neon-purple border-purple-800",
      aiSuggestedPercentage: 28,
      rationale: "Gourmet street food sliders, Korean bao buns & liquid nitrogen smoking cocktails."
    },
    decor: {
      id: "decor",
      name: "Decor & Florals",
      percentage: 14,
      allocatedAmount: 1540,
      spentAmount: 1400,
      iconName: "Sparkles",
      color: "#ec4899",
      lightBg: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800",
      aiSuggestedPercentage: 14,
      rationale: "Custom neon sign ('LEVEL 30 UNLOCKED'), LED light tubes & reflective metallic backdrops."
    },
    entertainment: {
      id: "entertainment",
      name: "Entertainment & AV",
      percentage: 16,
      allocatedAmount: 1760,
      spentAmount: 1600,
      iconName: "Music",
      color: "#8b5cf6",
      lightBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      aiSuggestedPercentage: 16,
      rationale: "Electronic synthwave DJ, laser mapping & VR arcade booth setup."
    },
    photography: {
      id: "photography",
      name: "Photo & Video",
      percentage: 7,
      allocatedAmount: 770,
      spentAmount: 750,
      iconName: "Camera",
      color: "#06b6d4",
      lightBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
      aiSuggestedPercentage: 7,
      rationale: "360-degree slow motion video spinner booth + photographer for 3 hours."
    },
    contingency: {
      id: "contingency",
      name: "Contingency Fund",
      percentage: 5,
      allocatedAmount: 550,
      spentAmount: 100,
      iconName: "ShieldAlert",
      color: "#10b981",
      lightBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      aiSuggestedPercentage: 5,
      rationale: "Buffer for extra bartender hours or extra cocktail supplies."
    }
  },
  milestones: [
    {
      id: "mb-1",
      phase: "Phase 1: Vibe & Location",
      timeframe: "8 Weeks Out",
      tasks: [
        { id: "tb-1", title: "Reserve Rooftop Lounge & Secure Sound Permits", completed: true, category: "venue" },
        { id: "tb-2", title: "Commission Custom Neon Signage", completed: true, category: "decor" },
        { id: "tb-3", title: "Lock in DJ specializing in synthwave & nu-disco", completed: true, category: "entertainment" }
      ]
    },
    {
      id: "mb-2",
      phase: "Phase 2: Guest Experience",
      timeframe: "4 Weeks Out",
      tasks: [
        { id: "tb-4", title: "Design Cyberpunk Digital E-Vite with RSVP Tracking", completed: true, category: "general" },
        { id: "tb-5", title: "Curate Signature Cocktail Menu with Mixologist", completed: false, category: "catering" },
        { id: "tb-6", title: "Book 360-Degree Glam Video Spinner", completed: true, category: "photography" }
      ]
    },
    {
      id: "mb-3",
      phase: "Phase 3: Final Countdown",
      timeframe: "1 Week Out",
      tasks: [
        { id: "tb-7", title: "Confirm Rooftop Heaters & Weather Contingency", completed: false, category: "venue" },
        { id: "tb-8", title: "Finalize Guest List & Security Door Check-in", completed: false, category: "general" }
      ]
    }
  ],
  dayOfSchedule: [
    {
      id: "bday-dos-1",
      time: "04:00 PM",
      durationMinutes: 90,
      title: "Audio & Laser Rig Setup",
      category: "AV",
      leadPerson: "Sound Tech (Devin)",
      notes: "Check subwoofers and decibel compliance.",
      completed: true
    },
    {
      id: "bday-dos-2",
      time: "06:00 PM",
      durationMinutes: 60,
      title: "Bar Prep & LED High-top Illumination",
      category: "Setup",
      leadPerson: "Mixologist Lead",
      notes: "Stock dry ice for smoking cocktails.",
      completed: false
    },
    {
      id: "bday-dos-3",
      time: "07:30 PM",
      durationMinutes: 60,
      title: "VIP Doors Open & Ambient Beats",
      category: "Entry",
      leadPerson: "Door Host",
      notes: "Give glow wristbands upon entry.",
      completed: false
    },
    {
      id: "bday-dos-4",
      time: "09:00 PM",
      durationMinutes: 30,
      title: "Birthday Toast & Roast Highlight",
      category: "Celebration",
      leadPerson: "Best Friend / MC",
      notes: "Queue up customized video montage.",
      completed: false
    },
    {
      id: "bday-dos-5",
      time: "09:30 PM",
      durationMinutes: 150,
      title: "Peak Energy DJ Set & 360 Video Booth",
      category: "Party",
      leadPerson: "DJ Kairo",
      notes: "Late night sliders at 11 PM.",
      completed: false
    }
  ],
  vendors: [
    {
      id: "vb-1",
      name: "Skyline 360 Rooftop",
      category: "venue",
      contactPerson: "Austin Events Team",
      email: "booking@skyline360.atx",
      phone: "+1 (512) 555-7890",
      estimatedCost: 3300,
      actualCost: 3300,
      status: "Paid",
      notes: "Contract signed, deposit paid, bar license included.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "vb-2",
      name: "Neon Dragon Asian Fusion Sliders",
      category: "catering",
      contactPerson: "Chef Kenji",
      email: "kenji@neondragon.food",
      phone: "+1 (512) 555-4421",
      estimatedCost: 2800,
      actualCost: 2800,
      status: "Booked",
      notes: "Custom mini bao buns with vegetarian Jackfruit option.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "vb-3",
      name: "Prism Laser & DJ Production",
      category: "entertainment",
      contactPerson: "Kai Vance",
      email: "kai@prismproduction.io",
      phone: "+1 (512) 555-9012",
      estimatedCost: 1600,
      actualCost: 1600,
      status: "Booked",
      notes: "Bringing 2 laser projectors and wireless microphones.",
      contractSigned: true,
      depositPaid: true
    }
  ],
  ideaLab: {
    themeConcept: "Neon Horizon: Level 30 Cyberpunk Rooftop",
    themeDescription: "A high-octane modern milestone celebration featuring ultraviolet ambient washes, mirrored metallic accents, electric cyan and magenta highlights, with interactive retro-futuristic experiences overlooking the city skyline.",
    keyAtmosphereWords: ["Electric", "Futuristic", "High Energy", "Immersive", "Vibrant"],
    colorPalette: [
      { name: "Cyan Spark", hex: "#00F0FF", usage: "Neon signage accents and LED cocktail stirrers" },
      { name: "Electric Magenta", hex: "#FF007F", usage: "Mood wash uplighting and custom photo backdrop" },
      { name: "Obsidian Midnight", hex: "#0B0E14", usage: "Tablecloths, stage matte finish, and VIP wristbands" },
      { name: "Holographic Silver", hex: "#E0E6ED", usage: "Balloon installations, foil invitations, and cups" },
      { name: "Hyper Violet", hex: "#7B2CBF", usage: "DJ booth glow and ambient drink coasters" }
    ],
    activities: [
      {
        id: "ab-1",
        title: "30-Year Trivia Showdown via Phone Kahoot",
        description: "Hilarious fast-paced trivia about the birthday star with real-time leaderboard on projector screen.",
        targetGroup: "All Guests",
        timeframe: "Mid Evening",
        tags: ["Interactive", "Laughs", "Digital"]
      },
      {
        id: "ab-2",
        title: "Liquid Nitrogen Dessert Bar",
        description: "Flash-frozen dragon's breath meringue treats that puff smoke when eaten.",
        targetGroup: "Social media crowd",
        timeframe: "Late Night",
        tags: ["Spectacle", "Culinary", "Viral"]
      }
    ],
    invitationCopies: [
      {
        style: "Modern & Chic",
        subject: "LEVEL 30: Leo's Cyberpunk Birthday Rooftop",
        body: "Leaving the twenties behind in high gear. Join Leo for skyline views, electric beats, signature cocktails, and late-night celebrations. Dress code: Sleek & Neon-Chic."
      },
      {
        style: "Short & Punchy",
        subject: "Leo turns 30 | Rooftop Party",
        body: "Skyline Loft. Nov 14th @ 7:30 PM. Good music, open bar, unforgettable night. RSVP now."
      },
      {
        style: "Warm & Whimsical",
        subject: "Three Decades of Awesome: Celebrate Leo!",
        body: "It's time to mark 30 amazing years! Come dance under the neon stars, enjoy top-shelf cocktails, and make memories with the best crew in town."
      },
      {
        style: "Formal & Royal",
        subject: "You Are Cordially Invited to Leo's 30th Gala",
        body: "Celebrate thirty years of life, achievements, and future dreams. Join us for an elevated evening of panoramic city views and fine spirits."
      }
    ],
    customChatHistory: []
  }
};

export const TEMPLATE_CORPORATE: EventVerseState = {
  version: "1.0",
  lastUpdated: new Date().toISOString(),
  isAiGenerating: false,
  aiMode: "mock",
  event: {
    id: "template-corp-03",
    title: "Global Tech Horizon Summit & Annual Gala",
    type: "corporate",
    totalBudget: 75000,
    currency: "USD",
    guestCount: 300,
    date: "2026-12-05",
    location: "Metropolitan Grand Ballroom, San Francisco",
    vibe: "Sophisticated executive networking, keynote excellence, seamless modern tech",
    culturalDietary: "International buffet, certified Halal, Kosher-certified box options, zero-alcohol mocktail lounge",
    priorityFocus: "balanced"
  },
  budgetAllocations: {
    venue: {
      id: "venue",
      name: "Venue & Rentals",
      percentage: 26,
      allocatedAmount: 19500,
      spentAmount: 19500,
      iconName: "Building2",
      color: "#6366f1",
      lightBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      aiSuggestedPercentage: 26,
      rationale: "Convention ballroom with breakout rooms and sponsor exhibition foyer."
    },
    catering: {
      id: "catering",
      name: "Catering & Bar",
      percentage: 30,
      allocatedAmount: 22500,
      spentAmount: 21000,
      iconName: "Utensils",
      color: "#00F0FF",
      lightBg: "bg-purple-950/40 text-neon-purple border-purple-800",
      aiSuggestedPercentage: 30,
      rationale: "Continental breakfast, networking plated lunch, executive dessert reception."
    },
    decor: {
      id: "decor",
      name: "Decor & Florals",
      percentage: 12,
      allocatedAmount: 9000,
      spentAmount: 8500,
      iconName: "Sparkles",
      color: "#ec4899",
      lightBg: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800",
      aiSuggestedPercentage: 12,
      rationale: "Branded stage backdrops, LED wall framing, elegant minimalist floral centerpieces."
    },
    entertainment: {
      id: "entertainment",
      name: "Entertainment & AV",
      percentage: 18,
      allocatedAmount: 13500,
      spentAmount: 13000,
      iconName: "Music",
      color: "#8b5cf6",
      lightBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      aiSuggestedPercentage: 18,
      rationale: "Broadcast-quality live-streaming, 4K LED displays, keynote sound technicians, professional MC."
    },
    photography: {
      id: "photography",
      name: "Photo & Video",
      percentage: 9,
      allocatedAmount: 6750,
      spentAmount: 6500,
      iconName: "Camera",
      color: "#06b6d4",
      lightBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
      aiSuggestedPercentage: 9,
      rationale: "Executive headshot pop-up lounge, event coverage, same-day press recap video."
    },
    contingency: {
      id: "contingency",
      name: "Contingency Fund",
      percentage: 5,
      allocatedAmount: 3750,
      spentAmount: 500,
      iconName: "ShieldAlert",
      color: "#10b981",
      lightBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      aiSuggestedPercentage: 5,
      rationale: "Last-minute speaker green room logistics & emergency AV adapters."
    }
  },
  milestones: [
    {
      id: "mc-1",
      phase: "Phase 1: Strategy & Keynotes",
      timeframe: "6 Months Out",
      tasks: [
        { id: "tc-1", title: "Confirm Convention Center & Technical RFP", completed: true, category: "venue" },
        { id: "tc-2", title: "Secure Tier-1 Industry Keynote Speakers", completed: true, category: "general" },
        { id: "tc-3", title: "Launch Registration & Sponsor Package Portal", completed: true, category: "general" }
      ]
    },
    {
      id: "mc-2",
      phase: "Phase 2: Production & Logistics",
      timeframe: "3 Months Out",
      tasks: [
        { id: "tc-4", title: "Contract AV & Hybrid Livestreaming Partner", completed: true, category: "entertainment" },
        { id: "tc-5", title: "Finalize Multi-dietary Executive Catering RFP", completed: false, category: "catering" },
        { id: "tc-6", title: "Sponsor Booth Allocation & Badge Printing Vendor", completed: false, category: "general" }
      ]
    }
  ],
  dayOfSchedule: [
    {
      id: "corp-dos-1",
      time: "07:30 AM",
      durationMinutes: 60,
      title: "Registration Check-in & Continental Breakfast",
      category: "Reception",
      leadPerson: "Registration Team",
      notes: "QR badge printing at self-serve kiosks.",
      completed: true
    },
    {
      id: "corp-dos-2",
      time: "09:00 AM",
      durationMinutes: 75,
      title: "Opening Keynote: Future of Intelligence",
      category: "Keynote",
      leadPerson: "Main Stage AV Lead",
      notes: "Livestream stream check 15m prior.",
      completed: false
    },
    {
      id: "corp-dos-3",
      time: "12:30 PM",
      durationMinutes: 90,
      title: "Executive Networking Luncheon",
      category: "Dining",
      leadPerson: "Catering Supervisor",
      notes: "Dietary stations clearly marked with signage.",
      completed: false
    },
    {
      id: "corp-dos-4",
      time: "05:00 PM",
      durationMinutes: 120,
      title: "Gala Awards & Closing Cocktail Reception",
      category: "Gala",
      leadPerson: "MC & Event Director",
      notes: "Awards hand-off staged stage-left.",
      completed: false
    }
  ],
  vendors: [
    {
      id: "vc-1",
      name: "Metropolitan Grand Center",
      category: "venue",
      contactPerson: "David Ross",
      email: "david@metropolitangrand.com",
      phone: "+1 (415) 555-1100",
      estimatedCost: 19500,
      actualCost: 19500,
      status: "Paid",
      notes: "Includes main auditorium, 3 breakout salons and high-speed fiber WiFi.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "vc-2",
      name: "Summit Audio-Visual & Broadcast Co.",
      category: "entertainment",
      contactPerson: "Rachel Klein",
      email: "rachel@summitav.live",
      phone: "+1 (415) 555-7762",
      estimatedCost: 13000,
      actualCost: 13000,
      status: "Booked",
      notes: "Dual 4K LED walls, switcher consoles, 6 wireless lapels, live stream engineer.",
      contractSigned: true,
      depositPaid: true
    }
  ],
  ideaLab: {
    themeConcept: "Nexus Platinum: Innovation & Connectivity",
    themeDescription: "A minimalist, sleek executive gala designed with deep midnight blue foundations, polished platinum lines, subtle warm champagne illumination, and interactive AI showcases.",
    keyAtmosphereWords: ["Prestige", "Seamless", "Forward-Thinking", "Collaborative", "Refined"],
    colorPalette: [
      { name: "Deep Midnight", hex: "#0A192F", usage: "Main auditorium draping and stage backdrop" },
      { name: "Platinum Frost", hex: "#E2E8F0", usage: "Signage, podium accents, and typography" },
      { name: "Executive Champagne", hex: "#D4AF37", usage: "Gala award trophies and VIP lounge accents" },
      { name: "Horizon Cyan", hex: "#0EA5E9", usage: "LED stage lighting bars and digital badge screens" },
      { name: "Slate Mist", hex: "#64748B", usage: "Lanyard accents, agenda programs, and table runners" }
    ],
    activities: [
      {
        id: "ac-1",
        title: "Executive Headshot Studio Pop-up",
        description: "Professional photographers offering complimentary LinkedIn & speaking headshots with instant digital airdrop.",
        targetGroup: "All Attendees",
        timeframe: "All Day",
        tags: ["High Value", "Professional", "Popular"]
      },
      {
        id: "ac-2",
        title: "AI Interactive Vision Wall",
        description: "Large touch display where attendees contribute company predictions, visualised into dynamic word clusters and infographic maps.",
        targetGroup: "Innovators",
        timeframe: "Breakout Sessions",
        tags: ["AI", "Tech", "Networking"]
      }
    ],
    invitationCopies: [
      {
        style: "Formal & Royal",
        subject: "Formal Invitation: Global Tech Horizon Summit 2026",
        body: "You are invited to join global executives and visionaries at the Metropolitan Grand Ballroom for a day of transformative discourse, executive networking, and the annual innovation gala."
      },
      {
        style: "Modern & Chic",
        subject: "Join Us at Tech Horizon 2026",
        body: "The premier gathering for innovators, architects, and industry leaders. Reserve your seat for a future-defining experience."
      },
      {
        style: "Short & Punchy",
        subject: "Tech Horizon Summit: Invitation & Registration",
        body: "December 5, 2026. San Francisco. 300 Leaders. Keynotes, Networking, and Annual Gala. Register now."
      },
      {
        style: "Warm & Whimsical",
        subject: "Celebrate Innovation Together: Tech Horizon Gala",
        body: "Bringing together the brightest minds to celebrate one year of breakthroughs and preview the future."
      }
    ],
    customChatHistory: []
  }
};

export const TEMPLATE_ROYAL_SANGEET: EventVerseState = {
  version: "1.0",
  lastUpdated: new Date().toISOString(),
  isAiGenerating: false,
  aiMode: "mock",
  event: {
    id: "template-sangeet-04",
    title: "Aarav & Diya's Royal Sangeet & Heritage Palace Wedding",
    type: "wedding",
    totalBudget: 60000,
    currency: "USD",
    guestCount: 220,
    date: "2026-11-28",
    location: "Jagmandir Island Palace, Udaipur",
    vibe: "Regal Marigold & Crimson opulence, lakeside fireworks, live Sufi ensemble & royal hospitality",
    culturalDietary: "Traditional Rajasthani Thali, Jain Satvik counter, Live Chaat street stalls, zero-alcohol saffron milk bar",
    priorityFocus: "atmosphere"
  },
  budgetAllocations: {
    venue: {
      id: "venue",
      name: "Venue & Rentals",
      percentage: 30,
      allocatedAmount: 18000,
      spentAmount: 18000,
      iconName: "Building2",
      color: "#6366f1",
      lightBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      aiSuggestedPercentage: 30,
      rationale: "Heritage island palace booking including private boat ferrying across Lake Pichola."
    },
    catering: {
      id: "catering",
      name: "Catering & Bar",
      percentage: 28,
      allocatedAmount: 16800,
      spentAmount: 16000,
      iconName: "Utensils",
      color: "#00F0FF",
      lightBg: "bg-purple-950/40 text-neon-purple border-purple-800",
      aiSuggestedPercentage: 28,
      rationale: "Multi-course royal feasts, Dal Baati Churma, artisanal jalebi counter, and Jain dietary compliance."
    },
    decor: {
      id: "decor",
      name: "Decor & Florals",
      percentage: 20,
      allocatedAmount: 12000,
      spentAmount: 11500,
      iconName: "Sparkles",
      color: "#ec4899",
      lightBg: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800",
      aiSuggestedPercentage: 20,
      rationale: "10,000 fresh marigold garlands, brass urli lamps, silk canopy drapes, and floating lotus petals."
    },
    entertainment: {
      id: "entertainment",
      name: "Entertainment & AV",
      percentage: 12,
      allocatedAmount: 7200,
      spentAmount: 7000,
      iconName: "Music",
      color: "#8b5cf6",
      lightBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      aiSuggestedPercentage: 12,
      rationale: "Traditional Punjabi Dhol troupe, live Rajasthani folk dancers, Bollywood Sangeet DJ, and LED stage."
    },
    photography: {
      id: "photography",
      name: "Photo & Video",
      percentage: 6,
      allocatedAmount: 3600,
      spentAmount: 3600,
      iconName: "Camera",
      color: "#06b6d4",
      lightBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
      aiSuggestedPercentage: 6,
      rationale: "Cinematic drone reels, 4-member documentary photo crew, traditional portrait booth."
    },
    contingency: {
      id: "contingency",
      name: "Contingency Fund",
      percentage: 4,
      allocatedAmount: 2400,
      spentAmount: 400,
      iconName: "ShieldAlert",
      color: "#10b981",
      lightBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      aiSuggestedPercentage: 4,
      rationale: "Emergency boat shuttles and backup power generators."
    }
  },
  milestones: [
    {
      id: "ms-1",
      phase: "Phase 1: Palace & Traditional Contracts",
      timeframe: "8 - 10 Months Out",
      tasks: [
        { id: "ts-1", title: "Reserve Jagmandir Island Palace & Jetty Transit", completed: true, category: "venue" },
        { id: "ts-2", title: "Hire Royal Wedding Specialist (Ananya Mehra)", completed: true, category: "general" },
        { id: "ts-3", title: "Lock in Master Mehndi Artist (Noor)", completed: true, category: "general" }
      ]
    },
    {
      id: "ms-2",
      phase: "Phase 2: Choreography & Menu Tastings",
      timeframe: "3 - 5 Months Out",
      tasks: [
        { id: "ts-4", title: "Begin Family Sangeet Dance Rehearsals with Choreographer", completed: true, category: "entertainment" },
        { id: "ts-5", title: "Tasting Session for 40-Dish Royal Rajasthani Banquet", completed: false, category: "catering" },
        { id: "ts-6", title: "Commission Custom Sabyasachi & Manish Malhotra Attire", completed: true, category: "general" }
      ]
    }
  ],
  dayOfSchedule: [
    {
      id: "san-dos-1",
      time: "02:30 PM",
      durationMinutes: 90,
      title: "Bridal Mehndi & Saffron Welcome Drinks",
      category: "Tradition",
      leadPerson: "Lead Mehndi Artist Noor",
      notes: "Intricate bridal henna under central courtyard canopy.",
      completed: true
    },
    {
      id: "san-dos-2",
      time: "05:00 PM",
      durationMinutes: 45,
      title: "Guest Royal Boat Arrival at Palace Jetty",
      category: "Logistics",
      leadPerson: "Jetty Captain (Kishan)",
      notes: "Rose petal shower as guests step off boats.",
      completed: false
    },
    {
      id: "san-dos-3",
      time: "06:30 PM",
      durationMinutes: 60,
      title: "Baraat Procession with Live Dhol Symphony",
      category: "Ceremony",
      leadPerson: "Dhol Lead (Gurpreet)",
      notes: "Groom royal entry with vintage umbrella entourage.",
      completed: false
    },
    {
      id: "san-dos-4",
      time: "08:00 PM",
      durationMinutes: 90,
      title: "Family Sangeet Dance Performances & Competitions",
      category: "Sangeet",
      leadPerson: "Choreographer (Rohan) & MC",
      notes: "12 choreographed family dances on illuminated glass stage.",
      completed: false
    },
    {
      id: "san-dos-5",
      time: "09:30 PM",
      durationMinutes: 120,
      title: "Royal Feast, Lake Pichola Fireworks & Late-Night Sufi",
      category: "Feast",
      leadPerson: "Banquet Captain (Vikram)",
      notes: "Synchronized fireworks over lake at 10:15 PM.",
      completed: false
    }
  ],
  vendors: [
    {
      id: "vs-1",
      name: "Jagmandir Island Palace",
      category: "venue",
      contactPerson: "Maharaja Hospitality Desk",
      email: "palace@jagmandir-udaipur.in",
      phone: "+91 294 555 1800",
      estimatedCost: 18000,
      actualCost: 18000,
      status: "Paid",
      notes: "Island exclusive reservation with 4 ferry boats included.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "vs-2",
      name: "Mewar Royal Culinary Banquets",
      category: "catering",
      contactPerson: "Chef Vikram Rathore",
      email: "vikram@mewarbangquet.in",
      phone: "+91 982 555 2200",
      estimatedCost: 16000,
      actualCost: 16000,
      status: "Booked",
      notes: "Strict separate Jain kitchen prep counters; 100% vegetarian.",
      contractSigned: true,
      depositPaid: true
    },
    {
      id: "vs-3",
      name: "Marigold Dreams Floral Architecture",
      category: "decor",
      contactPerson: "Priya Chawla",
      email: "priya@marigolddreams.in",
      phone: "+91 981 555 3300",
      estimatedCost: 11500,
      actualCost: 11500,
      status: "Booked",
      notes: "Direct sourcing from Pushkar flower markets.",
      contractSigned: true,
      depositPaid: true
    }
  ],
  ideaLab: {
    themeConcept: "Kesariya Darbar: Royal Marigold & Lakeside Sunset",
    themeDescription: "A breathtaking tribute to royal Mewar heritage. Rich turmeric gold, deep vermilion crimson, polished brass diyas, and fragrant jasmine garlands mirrored against the twilight waters of Lake Pichola.",
    keyAtmosphereWords: ["Regal", "Festive", "Luminous", "Soulful", "Grand"],
    colorPalette: [
      { name: "Royal Kesariya Gold", hex: "#FF9933", usage: "Marigold garlands, bridal dupatta accents, and silk turbans" },
      { name: "Deep Vermilion Crimson", hex: "#990000", usage: "Palace drapery, velvet cushions, and royal stage canopy" },
      { name: "Palace Sandstone", hex: "#E8C39E", usage: "Carved stone backdrops, arches, and custom invitation cards" },
      { name: "Peacock Emerald", hex: "#006A4E", usage: "Foliage accents, Meenakari jewelry highlights, and table runners" },
      { name: "Lake Moonlight Ivory", hex: "#FFFDF0", usage: "Floating candles, linen napkins, and jasmine chandeliers" }
    ],
    activities: [
      {
        id: "as-1",
        title: "Traditional Turban & Floral Gajra Bar",
        description: "Artisans hand-tie bespoke Rajasthani turbans (safas) for gentlemen and fresh jasmine hair accessories (gajras) for ladies upon arrival.",
        targetGroup: "All Guests",
        timeframe: "Welcome Hour",
        tags: ["Cultural", "Photogenic", "Traditional"]
      },
      {
        id: "as-2",
        title: "Live Street Chaat & Kulfi Falooda Bazaars",
        description: "Interactive chef carts rolling out Pani Puri shots, Dahi Vada, and rabdi kulfi in terracotta matkas.",
        targetGroup: "Food Lovers",
        timeframe: "Mid Evening",
        tags: ["Culinary", "Experiential", "Hit"]
      }
    ],
    invitationCopies: [
      {
        style: "Formal & Royal",
        subject: "The Royal Sangeet of Aarav & Diya at Jagmandir Palace",
        body: "With the blessings of our elders and deities, the Sharma and Singhania families cordially invite you to celebrate the joyous Sangeet and wedding of Aarav and Diya amidst the historic splendor of Jagmandir Island Palace, Udaipur."
      },
      {
        style: "Modern & Chic",
        subject: "Aarav + Diya | The Royal Sangeet in Udaipur",
        body: "Join us for an unforgettable evening under palace arches with lake breezes, energetic dhol beats, delicious chaat, and high-energy family dance battles!"
      },
      {
        style: "Warm & Whimsical",
        subject: "Music, Marigolds & Eternal Love: Celebrate with Us",
        body: "Come dance, feast, and bless Aarav and Diya as they unite in love under the starry skies of Udaipur."
      },
      {
        style: "Short & Punchy",
        subject: "Aarav & Diya's Sangeet: Save the Date!",
        body: "Nov 28, 2026. Udaipur Palace. Great music, royal food, and celebrations. RSVP now."
      }
    ],
    customChatHistory: []
  }
};
