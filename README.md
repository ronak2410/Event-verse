# 🌟 EventVerse: AI Celebration & Event Planner

> **Full-Stack Generative AI Celebration Architect for Hackathon Evaluation**  
> Tailored for Weddings, Milestone Birthdays, Corporate Galas, and Community Festivals.

---

## 🚀 1. Overview & Core Purpose

Planning major life milestones is notoriously stressful: budgets fracture across hidden vendor costs, day-of run-of-shows fall out of sync with setup logistics, and creative themes feel generic.

**EventVerse** solves this by unifying generative intelligence and deterministic event planning across four synchronized pillars:

1. **Dynamic Budget Estimator**: Real-time slider-driven allocations across 6 critical categories (Venue, Catering, Decor, Entertainment, Photography, Contingency) with one-click AI strategic reallocation.
2. **Timeline & Schedule Generator**: Milestone phase countdown (months/weeks out) coupled with a granular, minute-by-minute **Day-of Event Run-of-Show** timetable with toggleable check-offs.
3. **Interactive Vendor Checklist & CRM**: Category-sorted procurement directory with status tracking (`Researching`, `Contacted`, `Booked`, `Paid`), contract flags, and editable notes.
4. **Personalized AI Idea Lab**: Multi-turn creative concierge generating bespoke atmosphere themes, HEX color palettes, engaging icebreakers/games, and multi-style draft invitation copies (Formal, Chic, Whimsical, Punchy).

---

## 🛠️ 2. Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server-side API Route Handlers)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS with custom luxury tokens (`brand` amber, `midnight` slate, glassmorphism blur)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: Reactive React hooks with automatic `localStorage` persistence layer (`eventverse_state_v1`)
- **Generative AI Layer**: 
  - Direct integration with **Google Gemini API** (`gemini-2.5-flash` or `gemini-1.5-flash`) using structured JSON system prompts.
  - **Zero-Failure Smart Fallback Mode**: If an API key is not supplied or during network interruptions, the application transparently leverages an internal deterministic blueprint engine, ensuring 100% testability for hackathon judges!

---

## 📂 3. Project Structure

```
Event-verse/
├── app/
│   ├── api/
│   │   └── ai/
│   │       └── route.ts          # Gemini API integration & fallback logic
│   ├── globals.css               # Modern slider styles, glassmorphism, dark theme
│   ├── layout.tsx                # Next.js App Router root layout
│   └── page.tsx                  # Master Dashboard assembling all 4 pillars
├── components/
│   ├── Header.tsx                # Navigation, export to Markdown, Gemini API key modal
│   ├── QuickTemplates.tsx        # 1-Click hackathon demo presets (Wedding, Birthday, Gala)
│   ├── StatHighlights.tsx        # KPI metrics (Total budget, spend %, guest count, milestones)
│   ├── EventWizardModal.tsx      # Comprehensive event setup & AI generation wizard
│   ├── BudgetEstimator/
│   │   ├── BudgetSection.tsx     # Master budget controller & strategic priority selector
│   │   ├── BudgetSlider.tsx      # Interactive category sliders with AI hints
│   │   └── BudgetVisualizer.tsx  # Dynamic multi-segment portfolio gauge
│   ├── Timeline/
│   │   ├── TimelineSection.tsx   # Milestone countdown & Day-of run-of-show tabs
│   │   ├── MilestoneCountdown.tsx# Phased milestones & custom task additions
│   │   └── DayOfRunOfShow.tsx    # Hour-by-hour operational timetable with lead assignments
│   ├── VendorTracker/
│   │   ├── VendorSection.tsx     # CRM overview cards & vendor table container
│   │   ├── VendorTable.tsx       # Search, filter pills, cost variance & editable notes
│   │   └── AddVendorModal.tsx    # Add new vendor modal
│   ├── IdeaLab/
│   │   ├── IdeaLabSection.tsx    # Theme overview, creative atmosphere & concierge
│   │   ├── PaletteDisplay.tsx    # Interactive color swatches with one-click HEX copying
│   │   ├── InvitationGenerator.tsx# Multi-tone invitation copies & clipboard copy
│   │   ├── ActivitiesList.tsx    # Curated guest activities, icebreakers, and tags
│   │   └── ChatAssistant.tsx     # Multi-turn brainstorming chat with suggested prompts
│   └── ui/
│       ├── Badge.tsx             # Semantic status pills & indicators
│       ├── Button.tsx            # Button variants (luxury, outline, ghost, loading)
│       ├── Card.tsx              # Glassmorphic card containers
│       └── Modal.tsx             # Accessible modal dialogs with keyboard ESC handling
├── hooks/
│   └── useEventState.ts          # Centralized event state & persistence hook
├── lib/
│   ├── gemini.ts                 # System prompts, JSON schema enforcement & smart fallback
│   ├── mockData.ts               # Pre-populated templates & metadata constants
│   ├── types.ts                  # Complete TypeScript definitions
│   └── utils.ts                  # Formatting, calculation benchmarks, markdown exporter
├── .env.example                  # Environment template
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## ⚡ 4. Getting Started

### Prerequisites
- Node.js 18.17+ or 20+

### Installation
```bash
# 1. Clone or navigate to the project directory
cd Event-verse

# 2. Install dependencies
npm install

# 3. (Optional) Configure Gemini API Key
cp .env.example .env.local
# Open .env.local and insert your GEMINI_API_KEY
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 5. Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key for live AI generation | Optional (smart mock fallback enabled) |
| `NEXT_PUBLIC_GEMINI_MODEL` | Target Gemini Model | `gemini-2.5-flash` |

> **Pro Tip**: You can also enter or update your Gemini API Key directly in the UI by clicking the **"Set Gemini Key"** button in the header at any time.

---

## 🏆 6. Hackathon Evaluation Highlights

1. **Instant 1-Click Evaluation**: Judges can immediately click the demo presets at the top:
   - **Napa Vineyard Wedding** ($42,000 | 130 Guests)
   - **Neon 30th Rooftop Birthday** ($11,000 | 65 Guests)
   - **Global Tech Horizon Gala** ($75,000 | 300 Guests)
2. **Never Breaks on Refresh**: Full state (including custom vendors, slider tweaks, and chat history) is stored in `localStorage`.
3. **Structured JSON AI Output**: Strictly typed outputs guarantee that generated plans map 1:1 into cards, tables, and charts without malformed text.
4. **Export Readiness**: Click **"Export Plan"** in the header to instantly export the entire blueprint to clipboard as clean, formatted Markdown.
