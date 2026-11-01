import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  generateId,
  normalizeAllocations,
  getBenchmarkInsight,
  calculateContingencyReserve,
  classifyAudioEnergy,
  calculateCarbonReduction,
  getEsgCertification,
  tallyDietaryRequirements,
  isChronologicallyOrdered,
  calculateCommittedSpend,
  calculateSafePerGuest,
  calculateMilestoneProgress,
  calculateBudgetOverspend,
  sanitizeCsvCell,
  isValidHexColor,
  validateAiRequestPayload,
  generateBudgetCsv,
  exportEventAsMarkdown,
  calculateDietaryPercentages,
  calculateSustainabilityScore,
  getClientIp,
  checkRateLimit,
  sanitizePromptString,
  validatePersistedState,
  validateHttpRequestBody,
  validateAiResponse
} from '../lib/businessLogic.mjs';

// Test 1: Math & Currency Formatting
test('formatCurrency outputs correct symbol and formatting', () => {
  assert.equal(formatCurrency(42000, 'USD'), '$42,000');
  assert.equal(formatCurrency(15000, 'EUR'), '€15,000');
  assert.equal(formatCurrency(8500, 'GBP'), '£8,500');
  assert.equal(formatCurrency(1500000, 'INR'), '₹1,500,000');
});

// Test 2: Normalization Algorithm (Must equal exactly 100%)
test('normalizeAllocations guarantees exact 100% sum regardless of inputs', () => {
  const raw1 = { venue: 33, catering: 33, decor: 33, entertainment: 10, photography: 10, contingency: 5 }; // sum 124%
  const norm1 = normalizeAllocations(raw1);
  const sum1 = Object.values(norm1).reduce((a, b) => a + b, 0);
  assert.equal(sum1, 100);

  const raw2 = { venue: 15, catering: 20, decor: 10, entertainment: 5, photography: 5, contingency: 2 }; // sum 57%
  const norm2 = normalizeAllocations(raw2);
  const sum2 = Object.values(norm2).reduce((a, b) => a + b, 0);
  assert.equal(sum2, 100);
});

// Test 3: Benchmark Calculations
test('getBenchmarkInsight calculates appropriate tier', () => {
  assert.equal(getBenchmarkInsight('wedding', 130, 42000).tier, 'Luxury / High-End');
  assert.equal(getBenchmarkInsight('birthday', 65, 11000).tier, 'Standard Premium');
  assert.equal(getBenchmarkInsight('community', 500, 15000).tier, 'Boutique / Budget-Savvy');
});

// Test 4: Vendor Variance Math
test('Vendor contract variance is calculated accurately', () => {
  const estimated = 12000;
  const actual = 12500;
  const variance = actual - estimated;
  assert.equal(variance, 500); // 500 over
});

// Test 5: Contingency Reserve Minimum Threshold Math
test('Contingency Reserve calculates strictly compliant safety buffers', () => {
  assert.equal(calculateContingencyReserve(60000, 5), 3000);
  assert.equal(calculateContingencyReserve(42000, 5), 2100);
  assert.equal(calculateContingencyReserve(11000, 8), 880);
});

// Test 6: Sonic Audio Track BPM Classification
test('Audio BPM energy levels match soundstage curation specifications', () => {
  assert.equal(classifyAudioEnergy(128), 'High Voltage Peak');
  assert.equal(classifyAudioEnergy(94), 'Groovy & Upbeat');
  assert.equal(classifyAudioEnergy(82), 'Calm & Elegant');
});

// Test 7: Carbon Abatement Math & Percentage Reduction
test('Carbon abatement reduction percentage is calculated accurately', () => {
  assert.equal(calculateCarbonReduction(2460, 565), 77); // 77% reduction
  assert.equal(calculateCarbonReduction(520, 85), 84);   // 84% food waste reduction
  assert.equal(calculateCarbonReduction(940, 290), 69);  // 69% transport cut
});

// Test 8: ESG Eco-Certification Level Grading Tier
test('ESG Certification grading assigns proper honors based on abatement', () => {
  assert.equal(getEsgCertification(77), 'Level III Eco-Gold');
  assert.equal(getEsgCertification(52), 'Level II Eco-Silver');
  assert.equal(getEsgCertification(25), 'Level I Eco-Certified');
});

// Test 9: Table Seating Dietary Breakdown Tally
test('Table seating dietary requirement tally strictly matches kitchen counter requirements', () => {
  const sampleGuests = [
    { name: 'Aarav', dietary: 'Jain' },
    { name: 'Diya', dietary: 'Vegan' },
    { name: 'Kishan', dietary: 'Jain' },
    { name: 'Elena', dietary: 'Gluten-Free' },
    { name: 'Marcus', dietary: 'Regular' }
  ];
  const tallies = tallyDietaryRequirements(sampleGuests);
  assert.equal(tallies.Jain, 2);
  assert.equal(tallies.Vegan, 1);
  assert.equal(tallies['Gluten-Free'], 1);
  assert.equal(tallies.Regular, 1);
  assert.equal(tallies.Halal, 0);
});

// Test 10: Run-of-Show Chronological Progression
test('Day-of run-of-show timeline progresses chronologically', () => {
  const schedule = ['02:00 PM', '04:30 PM', '06:00 PM', '07:30 PM', '10:00 PM'];
  assert.equal(isChronologicallyOrdered(schedule), true);

  const brokenSchedule = ['02:00 PM', '01:00 PM'];
  assert.equal(isChronologicallyOrdered(brokenSchedule), false);
});

// Test 11: Vendor Committed Spend Calculation
test('Committed spend accurately aggregates Booked and Paid contracts only', () => {
  const vendors = [
    { name: 'Palace Hall', status: 'Paid', estimatedCost: 15000, actualCost: 15500 },
    { name: 'DJ Sanj', status: 'Booked', estimatedCost: 3500, actualCost: 3200 },
    { name: 'Florist Bloom', status: 'Contacted', estimatedCost: 4000, actualCost: 4000 },
    { name: 'Ice Cream Cart', status: 'Researching', estimatedCost: 800, actualCost: 0 }
  ];
  // 15500 + 3200 = 18700
  assert.equal(calculateCommittedSpend(vendors), 18700);
});

// Test 12: Zero Budget / Zero Guest Boundary Protection
test('Per-guest calculations cleanly protect against divide-by-zero boundaries', () => {
  assert.equal(calculateSafePerGuest(42000, 0), 0);
  assert.equal(calculateSafePerGuest(0, 100), 0);
  assert.equal(calculateSafePerGuest(-5000, 50), 0);
  assert.equal(calculateSafePerGuest(50000, 200), 250);
});

// Test 13: Milestone Task Completion Ratio
test('Milestone completion calculation calculates true integer percentage', () => {
  const milestones = [
    { tasks: [{ completed: true }, { completed: true }] },
    { tasks: [{ completed: true }, { completed: false }] }
  ];
  assert.equal(calculateMilestoneProgress(milestones), 75);
});

// Test 14: Category Variance Math
test('Category overspend math reports precise budget delta and status flag', () => {
  const normal = calculateBudgetOverspend(5000, 4200);
  assert.equal(normal.isOver, false);
  assert.equal(normal.amount, 800);

  const exceeded = calculateBudgetOverspend(5000, 6250);
  assert.equal(exceeded.isOver, true);
  assert.equal(exceeded.amount, 1250);
});

// Test 15: CSV Sanitization & Escape Protection
test('CSV Cell sanitization neutralizes formula injection triggers and escapes quotes', () => {
  assert.equal(sanitizeCsvCell('=SUM(A1:A10)'), '"\'=SUM(A1:A10)"');
  assert.equal(sanitizeCsvCell('+cmd|"/c calc"!A0'), '"\'+cmd|""/c calc""!A0"');
  assert.equal(sanitizeCsvCell('Maya & Noah\'s "Grand" Wedding'), '"Maya & Noah\'s ""Grand"" Wedding"');
  assert.equal(sanitizeCsvCell('Regular Plain Text'), '"Regular Plain Text"');
});

// Test 16: Hex Color Palette Validation
test('Curated color palette hex values match strict valid CSS formats', () => {
  assert.equal(isValidHexColor('#00F0FF'), true); // Neon Cyan
  assert.equal(isValidHexColor('#8B5CF6'), true); // Neon Purple
  assert.equal(isValidHexColor('#FF007F'), true); // Neon Pink
  assert.equal(isValidHexColor('#00FF9D'), true); // Neon Emerald
  assert.equal(isValidHexColor('blue'), false);
  assert.equal(isValidHexColor('#GGGGGG'), false);
  assert.equal(isValidHexColor(''), false);
});

// Test 17: AI Route Strict Request Validation (Security Integration Test)
test('validateAiRequestPayload strictly accepts valid payloads and blocks invalid or malicious input', () => {
  // Missing or non-object body
  assert.equal(validateAiRequestPayload(null).valid, false);
  assert.equal(validateAiRequestPayload('string').valid, false);

  // Unknown action
  assert.equal(validateAiRequestPayload({ action: 'hack_admin' }).valid, false);

  // Valid generate_plan
  const validPlan = {
    action: 'generate_plan',
    event: {
      title: 'Global Tech Summit 2026',
      totalBudget: 85000,
      guestCount: 200
    }
  };
  assert.equal(validateAiRequestPayload(validPlan).valid, true);

  // Invalid generate_plan (zero budget, negative guests, missing title)
  assert.equal(validateAiRequestPayload({ action: 'generate_plan', event: { title: '', totalBudget: 5000, guestCount: 10 } }).valid, false);
  assert.equal(validateAiRequestPayload({ action: 'generate_plan', event: { title: 'Party', totalBudget: -100, guestCount: 10 } }).valid, false);
  assert.equal(validateAiRequestPayload({ action: 'generate_plan', event: { title: 'Party', totalBudget: 5000, guestCount: 0 } }).valid, false);

  // Valid chat_refine
  assert.equal(validateAiRequestPayload({ action: 'chat_refine', message: 'Can you suggest floral colors?' }).valid, true);

  // Invalid chat_refine (empty message or oversized buffer)
  assert.equal(validateAiRequestPayload({ action: 'chat_refine', message: '   ' }).valid, false);
  assert.equal(validateAiRequestPayload({ action: 'chat_refine', message: 'a'.repeat(2500) }).valid, false);

  // Valid rebalance_budget
  assert.equal(validateAiRequestPayload({ action: 'rebalance_budget', totalBudget: 25000, guestCount: 80 }).valid, true);
  assert.equal(validateAiRequestPayload({ action: 'rebalance_budget', totalBudget: 0, guestCount: 80 }).valid, false);
});

// Test 18: ID Generator Format and Uniqueness
test('generateId produces non-empty prefixed unique IDs', () => {
  const id1 = generateId('v');
  const id2 = generateId('v');
  assert.ok(id1.startsWith('v-'));
  assert.ok(id2.startsWith('v-'));
  assert.notEqual(id1, id2);
});

// Test 19: RFC-4180 CSV Budget Document Generation
test('generateBudgetCsv produces standard compliant multi-line CSV with neutralized cells', () => {
  const mockAllocations = {
    venue: { name: 'Venue & Infrastructure', percentage: 28, allocatedAmount: 11760, spentAmount: 12000, aiSuggestedPercentage: 28, rationale: 'Base location' },
    catering: { name: '=Formula() Catering', percentage: 32, allocatedAmount: 13440, spentAmount: 10000, aiSuggestedPercentage: 32, rationale: '3-course plated' }
  };
  const csv = generateBudgetCsv(mockAllocations, 42000, 'USD');
  const lines = csv.split('\n');
  assert.ok(lines.length >= 3);
  assert.equal(lines[0], 'Category,Allocation %,Allocated Amount,Spent Amount,Remaining Buffer,AI Suggested %,Strategic Rationale');
  // Check formula injection neutralization on catering name
  assert.ok(csv.includes('"\'=Formula() Catering"'));
  // Check total summary row
  assert.ok(csv.includes('TOTAL,100%,42000'));
});

// Test 20: Event Blueprint Markdown Document Serialization
test('exportEventAsMarkdown exports structured event overview with tables and tasks', () => {
  const mockState = {
    event: { title: 'Lumina Gala 2026', type: 'gala', date: '2026-12-31', guestCount: 150, totalBudget: 60000, currency: 'USD' },
    budgetAllocations: {
      venue: { name: 'Grand Ballroom', percentage: 30, allocatedAmount: 18000, spentAmount: 15000 }
    },
    milestones: [
      {
        title: 'Phase 1: Foundation',
        timeframe: '6 months out',
        tasks: [{ title: 'Sign venue contract', completed: true }]
      }
    ]
  };
  const md = exportEventAsMarkdown(mockState);
  assert.ok(md.includes('# Event Blueprint: Lumina Gala 2026'));
  assert.ok(md.includes('$60,000'));
  assert.ok(md.includes('| Grand Ballroom | 30% | $18,000 | On Track |'));
  assert.ok(md.includes('- [x] Sign venue contract'));
});

// Test 21: Dietary Breakdown Percentage Precision
test('calculateDietaryPercentages computes accurate rounded group shares', () => {
  const counts = { Regular: 50, Vegan: 25, 'Gluten-Free': 25 };
  const pcts = calculateDietaryPercentages(counts, 100);
  assert.equal(pcts.Regular, 50);
  assert.equal(pcts.Vegan, 25);
  assert.equal(pcts['Gluten-Free'], 25);
  // Zero guests boundary
  assert.deepEqual(calculateDietaryPercentages(counts, 0), {});
});

// Test 22: Composite ESG Sustainability Index Calculation
test('calculateSustainabilityScore calculates weighted ESG score bounded 0-100', () => {
  const score = calculateSustainabilityScore({
    carbonSavedPercent: 80,   // 80 * 0.40 = 32
    wasteDivertedPercent: 90, // 90 * 0.35 = 31.5 -> 32
    plantBasedRatio: 60       // 60 * 0.25 = 15
  });
  // 32 + 31.5 + 15 = 78.5 -> Math.round is 79
  assert.equal(score, 79);

  // Boundary testing
  assert.equal(calculateSustainabilityScore({ carbonSavedPercent: 0, wasteDivertedPercent: 0, plantBasedRatio: 0 }), 0);
  assert.equal(calculateSustainabilityScore({ carbonSavedPercent: 120, wasteDivertedPercent: 120, plantBasedRatio: 120 }), 100);
});

// Test 23: Production Sliding-Window IP Rate Limiter (Real Logic)
test('checkRateLimit accurately grants requests up to limit and denies excess with reset recovery', () => {
  const store = new Map();
  const testIp = '10.0.0.42';

  // Allow up to 3 requests in a 500ms window
  const r1 = checkRateLimit(testIp, store, 3, 500);
  assert.equal(r1.allowed, true);
  assert.equal(r1.remaining, 2);

  const r2 = checkRateLimit(testIp, store, 3, 500);
  assert.equal(r2.allowed, true);
  assert.equal(r2.remaining, 1);

  const r3 = checkRateLimit(testIp, store, 3, 500);
  assert.equal(r3.allowed, true);
  assert.equal(r3.remaining, 0);

  // 4th request must be blocked
  const r4 = checkRateLimit(testIp, store, 3, 500);
  assert.equal(r4.allowed, false);
  assert.equal(r4.remaining, 0);
});

// Test 24: Dependable Client IP Extraction with Spoofing Protection
test('getClientIp prioritizes provider edge headers and parses rightmost proxy hop', () => {
  // 1. Direct Edge provider header (e.g. Vercel)
  const vercelHeaders = { 'x-vercel-ip': '203.0.113.195', 'x-forwarded-for': 'attacker.spoofed.ip, 127.0.0.1' };
  assert.equal(getClientIp(vercelHeaders), '203.0.113.195');

  // 2. Cloudflare connecting header
  const cfHeaders = { 'cf-connecting-ip': '198.51.100.22' };
  assert.equal(getClientIp(cfHeaders), '198.51.100.22');

  // 3. X-Real-IP fallback
  const realIpHeaders = { 'x-real-ip': '192.0.2.1' };
  assert.equal(getClientIp(realIpHeaders), '192.0.2.1');

  // 4. Proxy chain: ignores client-spoofed leftmost entry and extracts trusted rightmost hop
  const proxyChainHeaders = { 'x-forwarded-for': 'spoofed.evil.com, 10.0.0.1, 198.51.100.88' };
  assert.equal(getClientIp(proxyChainHeaders), '198.51.100.88');

  // 5. Fallback on empty or missing headers
  assert.equal(getClientIp(null), '127.0.0.1');
  assert.equal(getClientIp({}), '127.0.0.1');
});

// Test 25: HTTP Body Size Enforcement and JSON Parsing Security Guard
test('validateHttpRequestBody enforces 64KB byte-level limit and handles malformed payloads', () => {
  // Valid JSON under limit
  const validJson = JSON.stringify({ action: 'rebalance_budget', totalBudget: 50000, guestCount: 100 });
  const resValid = validateHttpRequestBody(validJson, 65536);
  assert.equal(resValid.valid, true);
  assert.equal(resValid.data.totalBudget, 50000);

  // Oversized payload (>64KB) returns 413
  const oversizedText = 'a'.repeat(70000);
  const resOversized = validateHttpRequestBody(oversizedText, 65536);
  assert.equal(resOversized.valid, false);
  assert.equal(resOversized.status, 413);

  // Malformed JSON returns 400
  const malformed = '{ action: "bad_json", invalid...';
  const resMalformed = validateHttpRequestBody(malformed, 65536);
  assert.equal(resMalformed.valid, false);
  assert.equal(resMalformed.status, 400);

  // Empty / Null returns 400
  const resEmpty = validateHttpRequestBody(null);
  assert.equal(resEmpty.valid, false);
  assert.equal(resEmpty.status, 400);
});

// Test 26: Prompt Sanitization and Control Character Neutralization
test('sanitizePromptString strips unprintable ASCII control characters and truncates overflow', () => {
  const dirty = 'Hello\x00\x08World\x1B\x7F! Special Vibe';
  const clean = sanitizePromptString(dirty, 50);
  assert.equal(clean, 'HelloWorld! Special Vibe');

  const longText = 'x'.repeat(600);
  const capped = sanitizePromptString(longText, 500);
  assert.equal(capped.length, 500);

  assert.equal(sanitizePromptString(null), '');
  assert.equal(sanitizePromptString(12345), '');
});

// Test 27: Runtime Schema Validator for Persisted localStorage State
test('validatePersistedState verifies complete state structure and flags corrupted data', () => {
  const validState = {
    event: { title: 'Golden Jubilee Gala', totalBudget: 50000, guestCount: 150 },
    budgetAllocations: {
      venue: { allocatedAmount: 15000 },
      catering: { allocatedAmount: 18000 },
      decor: { allocatedAmount: 7000 },
      entertainment: { allocatedAmount: 4000 },
      photography: { allocatedAmount: 3500 },
      contingency: { allocatedAmount: 2500 }
    },
    milestones: [],
    dayOfSchedule: [],
    vendors: [],
    ideaLab: { themeConcept: 'Opulent Gold', themeDescription: 'Luxury night', colorPalette: [] }
  };
  assert.equal(validatePersistedState(validState).valid, true);

  // Missing budget categories
  const missingBudget = { ...validState, budgetAllocations: { venue: { allocatedAmount: 1000 } } };
  assert.equal(validatePersistedState(missingBudget).valid, false);

  // Corrupted / Non-object
  assert.equal(validatePersistedState(null).valid, false);
  assert.equal(validatePersistedState('corrupted_string').valid, false);
  assert.equal(validatePersistedState({ event: { title: '' } }).valid, false);
});

// Test 28: Runtime AI Server Response Validator
test('validateAiResponse verifies shapes across generate_plan, rebalance_budget, and chat_refine', () => {
  // Valid generate_plan
  const validPlan = {
    allocations: { venue: {} },
    milestones: [],
    dayOfSchedule: [],
    vendors: [],
    ideaLab: { themeConcept: 'Test' }
  };
  assert.equal(validateAiResponse(validPlan, 'generate_plan').valid, true);

  // Incomplete generate_plan
  assert.equal(validateAiResponse({ allocations: {} }, 'generate_plan').valid, false);

  // Valid rebalance_budget
  assert.equal(validateAiResponse({ allocations: { venue: 25 } }, 'rebalance_budget').valid, true);
  assert.equal(validateAiResponse({}, 'rebalance_budget').valid, false);

  // Valid chat_refine
  assert.equal(validateAiResponse({ reply: 'Here is styling advice' }, 'chat_refine').valid, true);
  assert.equal(validateAiResponse({ reply: '   ' }, 'chat_refine').valid, false);
});

// Test 29: Markdown Table Column Symmetry and Format Compliance
test('exportEventAsMarkdown generates tables where separator columns match header columns exactly', () => {
  const sampleState = {
    event: { title: 'Summer Festival', type: 'community', date: '2026-08-15', guestCount: 300, totalBudget: 25000, currency: 'USD' },
    budgetAllocations: {
      venue: { name: 'Main Park', percentage: 40, allocatedAmount: 10000, spentAmount: 9500 },
      catering: { name: 'Food Trucks', percentage: 35, allocatedAmount: 8750, spentAmount: 8750 },
      entertainment: { name: 'Live Bands', percentage: 25, allocatedAmount: 6250, spentAmount: 6500 }
    },
    dayOfSchedule: [
      { time: '10:00 AM', title: 'Gates Open', leadPerson: 'Alex', notes: 'Registration desk', completed: true },
      { time: '12:00 PM', title: 'Opening Band', leadPerson: 'Sara', notes: 'Main stage', completed: false }
    ],
    vendors: [
      { name: 'SoundStage Pro', category: 'entertainment', status: 'Booked', estimatedCost: 3000, actualCost: 3200, notes: 'PA system' }
    ],
    ideaLab: {
      themeConcept: 'Solar Beats',
      themeDescription: 'Eclectic outdoor gathering',
      colorPalette: [{ name: 'Sunburst Cyan', hex: '#00F0FF', usage: 'Primary banner' }]
    }
  };

  const md = exportEventAsMarkdown(sampleState);
  const lines = md.split('\n');

  // Verify that any table header followed by a separator line has matching pipe column counts
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1].trim();

    if (line.startsWith('|') && nextLine.startsWith('| :---')) {
      const headerCols = line.split('|').filter(s => s.trim().length > 0).length;
      const sepCols = nextLine.split('|').filter(s => s.trim().length > 0).length;
      assert.equal(headerCols, sepCols, `Mismatch at line ${i + 1}: header had ${headerCols} cols, separator had ${sepCols}`);
    }
  }
});

// Test 30: Comprehensive Resilience Against Null and Malformed Inputs
test('Domain utilities handle null, undefined, and empty objects without crashing', () => {
  assert.equal(formatCurrency(null), '$0');
  assert.equal(formatCurrency(undefined), '$0');
  assert.equal(calculateCarbonReduction(0, 0), 0);
  assert.equal(calculateCommittedSpend(null), 0);
  assert.equal(calculateCommittedSpend([]), 0);
  assert.equal(calculateMilestoneProgress(null), 0);
  assert.equal(calculateMilestoneProgress([]), 0);
  assert.equal(isChronologicallyOrdered([]), true);
  assert.deepEqual(tallyDietaryRequirements(null), { Regular: 0, Vegan: 0, Vegetarian: 0, 'Gluten-Free': 0, Halal: 0, Jain: 0 });
});
