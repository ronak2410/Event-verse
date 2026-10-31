import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency, EventVerseState } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
  };

  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })}`;
}

export function generateId(prefix: string = 'ev'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
}

export function calculatePerGuest(total: number, guestCount: number, currency: Currency = 'USD'): string {
  if (!guestCount || guestCount <= 0) return formatCurrency(0, currency);
  return `${formatCurrency(Math.round(total / guestCount), currency)} / guest`;
}

export function getBenchmarkInsight(eventType: string, guestCount: number, totalBudget: number): {
  tier: 'Boutique / Budget-Savvy' | 'Standard Premium' | 'Luxury / High-End';
  perGuest: number;
  recommendation: string;
} {
  const perGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;
  
  if (perGuest < 80) {
    return {
      tier: 'Boutique / Budget-Savvy',
      perGuest,
      recommendation: 'Focus budget on high-impact areas like memorable catering & playlist; DIY small decor elements to maximize charm without inflating cost.'
    };
  } else if (perGuest <= 250) {
    return {
      tier: 'Standard Premium',
      perGuest,
      recommendation: 'Well-balanced budget tier allowing professional live entertainment, full-service catering, and seasoned photography coverage.'
    };
  } else {
    return {
      tier: 'Luxury / High-End',
      perGuest,
      recommendation: 'Elevated tier accommodating bespoke floral installations, curated culinary stations, experiential lighting, and keepsake gifts.'
    };
  }
}

export function exportStateAsMarkdown(state: EventVerseState): string {
  const { event, budgetAllocations, milestones, dayOfSchedule, vendors, ideaLab } = state;
  const currency = event.currency;

  let md = `# ${event.title}\n`;
  md += `**Event Type:** ${event.type.toUpperCase()} | **Date:** ${event.date || 'TBD'} | **Location:** ${event.location || 'TBD'}\n`;
  md += `**Guest Count:** ${event.guestCount} | **Total Budget:** ${formatCurrency(event.totalBudget, currency)}\n\n`;

  md += `## 1. Budget Breakdown\n`;
  md += `| Category | Allocation % | Amount | Spent | Status |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;
  Object.values(budgetAllocations).forEach(cat => {
    md += `| ${cat.name} | ${cat.percentage}% | ${formatCurrency(cat.allocatedAmount, currency)} | ${formatCurrency(cat.spentAmount, currency)} | ${cat.spentAmount > cat.allocatedAmount ? '⚠️ Over' : '✅ Within'} |\n`;
  });
  md += `\n`;

  md += `## 2. Day-of Run of Show\n`;
  md += `| Time | Schedule Milestone | Lead / Contact | Status |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  dayOfSchedule.forEach(item => {
    md += `| ${item.time} | ${item.title} (${item.notes || 'N/A'}) | ${item.leadPerson} | ${item.completed ? '[x] Done' : '[ ] Pending'} |\n`;
  });
  md += `\n`;

  md += `## 3. Vendor Tracker\n`;
  md += `| Vendor Name | Category | Status | Est. Cost | Actual Cost | Notes |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  vendors.forEach(v => {
    md += `| ${v.name} | ${v.category} | ${v.status} | ${formatCurrency(v.estimatedCost, currency)} | ${formatCurrency(v.actualCost, currency)} | ${v.notes || '-'} |\n`;
  });
  md += `\n`;

  md += `## 4. AI Concept & Palette\n`;
  md += `**Concept:** ${ideaLab.themeConcept}\n\n`;
  md += `**Overview:** ${ideaLab.themeDescription}\n\n`;
  md += `**Color Palette:**\n`;
  ideaLab.colorPalette.forEach(c => {
    md += `- **${c.name}** (${c.hex}): ${c.usage}\n`;
  });

  return md;
}
