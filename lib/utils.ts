import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency, EventVerseState } from "./types";
import {
  formatCurrency as _formatCurrency,
  generateId as _generateId,
  normalizeAllocations as _normalizeAllocations,
  getBenchmarkInsight as _getBenchmarkInsight,
  calculateContingencyReserve as _calculateContingencyReserve,
  classifyAudioEnergy as _classifyAudioEnergy,
  calculateCarbonReduction as _calculateCarbonReduction,
  getEsgCertification as _getEsgCertification,
  tallyDietaryRequirements as _tallyDietaryRequirements,
  isChronologicallyOrdered as _isChronologicallyOrdered,
  calculateCommittedSpend as _calculateCommittedSpend,
  calculateSafePerGuest as _calculateSafePerGuest,
  calculateMilestoneProgress as _calculateMilestoneProgress,
  calculateBudgetOverspend as _calculateBudgetOverspend,
  sanitizeCsvCell as _sanitizeCsvCell,
  isValidHexColor as _isValidHexColor,
  validateAiRequestPayload as _validateAiRequestPayload,
  generateBudgetCsv as _generateBudgetCsv,
  calculateDietaryPercentages as _calculateDietaryPercentages,
  calculateSustainabilityScore as _calculateSustainabilityScore,
  getClientIp as _getClientIp,
  checkRateLimit as _checkRateLimit,
  sanitizePromptString as _sanitizePromptString,
  validatePersistedState as _validatePersistedState,
  validateHttpRequestBody as _validateHttpRequestBody,
  validateAiResponse as _validateAiResponse
} from "./businessLogic.mjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = _formatCurrency;
export const generateId = _generateId;
export const normalizeAllocations = _normalizeAllocations;
export const getBenchmarkInsight = _getBenchmarkInsight;
export const calculateContingencyReserve = _calculateContingencyReserve;
export const classifyAudioEnergy = _classifyAudioEnergy;
export const calculateCarbonReduction = _calculateCarbonReduction;
export const getEsgCertification = _getEsgCertification;
export const tallyDietaryRequirements = _tallyDietaryRequirements;
export const isChronologicallyOrdered = _isChronologicallyOrdered;
export const calculateCommittedSpend = _calculateCommittedSpend;
export const calculateSafePerGuest = _calculateSafePerGuest;
export const calculateMilestoneProgress = _calculateMilestoneProgress;
export const calculateBudgetOverspend = _calculateBudgetOverspend;
export const sanitizeCsvCell = _sanitizeCsvCell;
export const isValidHexColor = _isValidHexColor;
export const validateAiRequestPayload = _validateAiRequestPayload;
export const generateBudgetCsv = _generateBudgetCsv;
export const calculateDietaryPercentages = _calculateDietaryPercentages;
export const calculateSustainabilityScore = _calculateSustainabilityScore;
export const getClientIp = _getClientIp;
export const checkRateLimit = _checkRateLimit;
export const sanitizePromptString = _sanitizePromptString;
export const validatePersistedState = _validatePersistedState;
export const validateHttpRequestBody = _validateHttpRequestBody;
export const validateAiResponse = _validateAiResponse;

export function calculatePerGuest(total: number, guestCount: number, currency: Currency = 'USD'): string {
  if (!guestCount || guestCount <= 0) return formatCurrency(0, currency);
  return `${formatCurrency(Math.round(total / guestCount), currency)} / guest`;
}

export function exportStateAsMarkdown(state: EventVerseState): string {
  const { event, budgetAllocations, dayOfSchedule, vendors, ideaLab } = state;
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
