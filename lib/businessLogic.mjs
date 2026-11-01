/**
 * EventVerse Core Business Logic Module
 * Provides pure domain math, benchmark calculations, sanitization, and verification rules
 * used across the entire application and imported directly by unit & integration test suites.
 */

/**
 * Currency Formatter
 */
export function formatCurrency(amount, currency = 'USD') {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
  };

  const symbol = symbols[currency] || '$';
  return `${symbol}${Number(amount || 0).toLocaleString('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })}`;
}

/**
 * Unique ID Generator
 */
export function generateId(prefix = 'ev') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
}

/**
 * Normalizes allocation percentages across budget categories so they strictly sum to 100%.
 */
export function normalizeAllocations(percentages) {
  const keys = Object.keys(percentages);
  const total = keys.reduce((acc, k) => acc + (percentages[k] || 0), 0);
  if (total === 0) return percentages;

  const result = {};
  let accumulated = 0;
  keys.forEach((k, idx) => {
    let newPct = Math.round(((percentages[k] || 0) / total) * 100);
    if (idx === keys.length - 1) {
      newPct = 100 - accumulated;
    } else {
      accumulated += newPct;
    }
    result[k] = newPct;
  });
  return result;
}

/**
 * Calculates per-guest spend tier and strategic planning insight.
 */
export function getBenchmarkInsight(eventType, guestCount, totalBudget) {
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

/**
 * Calculates contingency reserve amount based on total budget and safety percentage.
 */
export function calculateContingencyReserve(totalBudget, contingencyPercentage) {
  return Math.round(totalBudget * (contingencyPercentage / 100));
}

/**
 * Classifies audio track energy by BPM for the IdeaLab soundstage.
 */
export function classifyAudioEnergy(bpm) {
  if (bpm >= 120) return 'High Voltage Peak';
  if (bpm >= 90) return 'Groovy & Upbeat';
  return 'Calm & Elegant';
}

/**
 * Calculates percentage reduction in carbon emissions.
 */
export function calculateCarbonReduction(baselineKg, optimizedKg) {
  if (baselineKg <= 0) return 0;
  const saved = baselineKg - optimizedKg;
  return Math.round((saved / baselineKg) * 100);
}

/**
 * Determines ESG eco-certification tier based on percentage reduction.
 */
export function getEsgCertification(percentReduced) {
  if (percentReduced >= 60) return 'Level III Eco-Gold';
  if (percentReduced >= 40) return 'Level II Eco-Silver';
  return 'Level I Eco-Certified';
}

/**
 * Tallies dietary preferences across a guest list.
 */
export function tallyDietaryRequirements(guests) {
  const counts = { Regular: 0, Vegan: 0, Vegetarian: 0, 'Gluten-Free': 0, Halal: 0, Jain: 0 };
  if (!Array.isArray(guests)) return counts;
  guests.forEach(g => {
    if (counts[g.dietary] !== undefined) {
      counts[g.dietary]++;
    }
  });
  return counts;
}

/**
 * Verifies chronological progression of a 12-hour formatted timeline.
 */
export function isChronologicallyOrdered(times) {
  if (!Array.isArray(times) || times.length <= 1) return true;
  const toMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };
  const minutesList = times.map(toMinutes);
  for (let i = 1; i < minutesList.length; i++) {
    if (minutesList[i] < minutesList[i - 1]) return false;
  }
  return true;
}

/**
 * Calculates committed spend across vendors with Booked or Paid contracts.
 */
export function calculateCommittedSpend(vendors) {
  if (!Array.isArray(vendors)) return 0;
  return vendors
    .filter((v) => v.status === 'Booked' || v.status === 'Paid')
    .reduce((acc, v) => acc + (v.actualCost || v.estimatedCost || 0), 0);
}

/**
 * Safely calculates per-guest cost guarding against zero/negative boundaries.
 */
export function calculateSafePerGuest(totalBudget, guestCount) {
  if (!guestCount || guestCount <= 0) return 0;
  if (!totalBudget || totalBudget <= 0) return 0;
  return Math.round(totalBudget / guestCount);
}

/**
 * Calculates overall completion percentage of milestone tasks.
 */
export function calculateMilestoneProgress(milestones) {
  if (!Array.isArray(milestones)) return 0;
  const total = milestones.reduce((acc, m) => acc + (m.tasks ? m.tasks.length : 0), 0);
  if (total === 0) return 0;
  const completed = milestones.reduce((acc, m) => acc + (m.tasks ? m.tasks.filter((t) => t.completed).length : 0), 0);
  return Math.round((completed / total) * 100);
}

/**
 * Computes category budget variance and overspend flag.
 */
export function calculateBudgetOverspend(allocated, spent) {
  const diff = spent - allocated;
  return {
    isOver: diff > 0,
    amount: Math.abs(diff)
  };
}

/**
 * Neutralizes formula injection vulnerabilities (=, +, -, @) and escapes quotes for CSV export.
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  const stringValue = String(value);
  const neutralized = /^[=+\-@]/.test(stringValue) ? `'${stringValue}` : stringValue;
  return `"${neutralized.replace(/"/g, '""')}"`;
}

/**
 * Validates 3-digit or 6-digit hex color format.
 */
export function isValidHexColor(hex) {
  if (typeof hex !== 'string') return false;
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

/**
 * Validates AI request payload for /api/ai endpoint.
 */
export function validateAiRequestPayload(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid JSON payload' };
  }
  const allowedActions = ['generate_plan', 'chat_refine', 'rebalance_budget'];
  if (!body.action || !allowedActions.includes(body.action)) {
    return { valid: false, error: 'Invalid or unsupported action specified' };
  }
  if (body.action === 'generate_plan') {
    if (!body.event || typeof body.event !== 'object') {
      return { valid: false, error: 'Missing or malformed event details' };
    }
    if (!body.event.title || typeof body.event.title !== 'string' || body.event.title.trim().length === 0) {
      return { valid: false, error: 'Event title is required' };
    }
    if (typeof body.event.totalBudget !== 'number' || body.event.totalBudget <= 0) {
      return { valid: false, error: 'Total budget must be a positive number' };
    }
    if (typeof body.event.guestCount !== 'number' || body.event.guestCount <= 0) {
      return { valid: false, error: 'Guest count must be greater than zero' };
    }
  }
  if (body.action === 'chat_refine') {
    if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return { valid: false, error: 'User message cannot be empty' };
    }
    if (body.message.length > 2000) {
      return { valid: false, error: 'User message exceeds 2000 character limit' };
    }
  }
  if (body.action === 'rebalance_budget') {
    if (typeof body.totalBudget !== 'number' || body.totalBudget <= 0) {
      return { valid: false, error: 'Total budget must be a positive number' };
    }
    if (typeof body.guestCount !== 'number' || body.guestCount <= 0) {
      return { valid: false, error: 'Guest count must be greater than zero' };
    }
  }
  return { valid: true, error: null };
}

/**
 * Generates an RFC-4180 compliant CSV document from category allocations with full injection neutralization.
 */
export function generateBudgetCsv(budgetAllocations, totalBudget, currency = 'USD') {
  const headers = ['Category', 'Allocation %', 'Allocated Amount', 'Spent Amount', 'Remaining Buffer', 'AI Suggested %', 'Strategic Rationale'];
  const rows = Object.values(budgetAllocations).map(cat => [
    sanitizeCsvCell(cat.name),
    sanitizeCsvCell(`${cat.percentage}%`),
    cat.allocatedAmount,
    cat.spentAmount,
    cat.allocatedAmount - cat.spentAmount,
    sanitizeCsvCell(cat.aiSuggestedPercentage ? `${cat.aiSuggestedPercentage}%` : 'N/A'),
    sanitizeCsvCell(cat.rationale || '')
  ]);
  const totalSpent = Object.values(budgetAllocations).reduce((acc, c) => acc + (c.spentAmount || 0), 0);
  const summaryRow = ['TOTAL', '100%', totalBudget, totalSpent, totalBudget - totalSpent, 'N/A', 'Comprehensive Event Budget'];
  return [headers.join(','), ...rows.map(r => r.join(',')), summaryRow.join(',')].join('\n');
}

/**
 * Formats complete Event Blueprint as structured Markdown document.
 */
export function exportEventAsMarkdown(state) {
  const { event, budgetAllocations, milestones } = state;
  let md = `# Event Blueprint: ${event.title}\n\n`;
  md += `- **Event Type**: ${event.type}\n`;
  md += `- **Date**: ${event.date}\n`;
  md += `- **Guest Count**: ${event.guestCount}\n`;
  md += `- **Total Budget**: ${formatCurrency(event.totalBudget, event.currency)}\n\n`;

  md += `## Budget Allocation\n\n`;
  md += `| Category | Share | Amount | Status |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  Object.values(budgetAllocations).forEach(cat => {
    md += `| ${cat.name} | ${cat.percentage}% | ${formatCurrency(cat.allocatedAmount, event.currency)} | ${cat.spentAmount > cat.allocatedAmount ? 'Over Budget' : 'On Track'} |\n`;
  });

  md += `\n## Milestones (${milestones ? milestones.length : 0} Phases)\n\n`;
  if (Array.isArray(milestones)) {
    milestones.forEach(m => {
      md += `### ${m.title} (${m.timeframe})\n`;
      if (Array.isArray(m.tasks)) {
        m.tasks.forEach(t => {
          md += `- [${t.completed ? 'x' : ' '}] ${t.title}\n`;
        });
      }
      md += `\n`;
    });
  }

  return md;
}

/**
 * Computes dietary breakdown percentages rounded to single-decimal precision.
 */
export function calculateDietaryPercentages(counts, totalGuests) {
  if (!totalGuests || totalGuests <= 0) return {};
  const result = {};
  Object.keys(counts).forEach(k => {
    result[k] = Math.round(((counts[k] || 0) / totalGuests) * 100);
  });
  return result;
}

/**
 * Calculates composite ESG sustainability index (0-100).
 */
export function calculateSustainabilityScore({ carbonSavedPercent = 0, wasteDivertedPercent = 0, plantBasedRatio = 0 }) {
  const score = Math.round(carbonSavedPercent * 0.4 + wasteDivertedPercent * 0.35 + plantBasedRatio * 0.25);
  return Math.min(100, Math.max(0, score));
}

