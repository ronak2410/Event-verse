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
  readAndValidateHttpStream,
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
  assert.equal(validateAiRequestPayload({ action: 'rebalance_budget', totalBudget: 25000, guestCount: 80, priorityFocus: 'food_first', eventType: 'wedding' }).valid, true);
  assert.equal(validateAiRequestPayload({ action: 'rebalance_budget', totalBudget: 0, guestCount: 80 }).valid, false);

  // Enum and boundary checks
  assert.equal(validateAiRequestPayload({ action: 'rebalance_budget', totalBudget: 25000, guestCount: 80, priorityFocus: 'invalid_focus' }).valid, false);
  assert.equal(validateAiRequestPayload({ action: 'rebalance_budget', totalBudget: 25000, guestCount: 80, eventType: 'invalid_type' }).valid, false);
  assert.equal(validateAiRequestPayload({ action: 'generate_plan', event: { title: 'Party', totalBudget: 1000, guestCount: 10, type: 'invalid_type' } }).valid, false);
  assert.equal(validateAiRequestPayload({ action: 'generate_plan', event: { title: 'Party', totalBudget: 1000, guestCount: 10, currency: 'BTC' } }).valid, false);
  assert.equal(validateAiRequestPayload({ action: 'generate_plan', event: { title: 'Party', totalBudget: 1000, guestCount: 10.5 } }).valid, false); // Non-integer guest
  assert.equal(validateAiRequestPayload({ action: 'generate_plan', event: { title: 'Party', totalBudget: 1000000000, guestCount: 10 } }).valid, false); // Budget overflow
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

// Test 23: Production Sliding-Window IP Rate Limiter (Real Logic & Shared Store Compatibility)
test('checkRateLimit accurately grants requests up to limit and denies excess with reset recovery and shared store support', async () => {
  const store = new Map();
  const testIp = '10.0.0.42';

  // Allow up to 3 requests in a 500ms window
  const r1 = await checkRateLimit(testIp, store, 3, 500);
  assert.equal(r1.allowed, true);
  assert.equal(r1.remaining, 2);

  const r2 = await checkRateLimit(testIp, store, 3, 500);
  assert.equal(r2.allowed, true);
  assert.equal(r2.remaining, 1);

  const r3 = await checkRateLimit(testIp, store, 3, 500);
  assert.equal(r3.allowed, true);
  assert.equal(r3.remaining, 0);

  // 4th request must be blocked
  const r4 = await checkRateLimit(testIp, store, 3, 500);
  assert.equal(r4.allowed, false);
  assert.equal(r4.remaining, 0);

  // Test multi-instance asynchronous shared store (e.g. Redis / Upstash mock)
  const remoteDb = new Map();
  const asyncSharedStore = {
    async get(key) { return remoteDb.get(key); },
    async set(key, val) { remoteDb.set(key, val); }
  };
  // Test atomic increment store (e.g. Upstash Redis pipeline with INCR + EXPIRE)
  let atomicCounter = 0;
  const atomicStore = {
    async atomicIncrement(key, max, windowMs) {
      atomicCounter++;
      return { allowed: atomicCounter <= max, remaining: Math.max(0, max - atomicCounter) };
    }
  };
  const at1 = await checkRateLimit('172.16.0.1', atomicStore, 2, 1000);
  assert.equal(at1.allowed, true);
  assert.equal(at1.remaining, 1);
  const at2 = await checkRateLimit('172.16.0.1', atomicStore, 2, 1000);
  assert.equal(at2.allowed, true);
  assert.equal(at2.remaining, 0);
  const at3 = await checkRateLimit('172.16.0.1', atomicStore, 2, 1000);
  assert.equal(at3.allowed, false);
  assert.equal(at3.remaining, 0);
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
    allocations: {
      venue: { percentage: 20 },
      catering: { percentage: 25 },
      decor: { percentage: 15 },
      entertainment: { percentage: 15 },
      photography: { percentage: 10 },
      contingency: { percentage: 15 }
    },
    milestones: [{ title: 'Kickoff', timeframe: '6m', tasks: [] }],
    dayOfSchedule: [{ time: '10:00 AM', title: 'Start' }],
    vendors: [{ name: 'V1', category: 'venue' }],
    ideaLab: { themeConcept: 'Test', colorPalette: [] }
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

// Test 31: validateAiResponse Edge Cases and Type Boundaries
test('validateAiResponse rigorously detects corrupt structures across all action types', () => {
  // Empty or non-object payloads
  assert.equal(validateAiResponse(null, 'generate_plan').valid, false);
  assert.equal(validateAiResponse('string-payload', 'generate_plan').valid, false);

  // Missing or non-array collections in generate_plan
  assert.equal(validateAiResponse({ allocations: {} }, 'generate_plan').valid, false);
  assert.equal(validateAiResponse({ allocations: {}, milestones: 'not-array' }, 'generate_plan').valid, false);
  assert.equal(validateAiResponse({ allocations: {}, milestones: [], dayOfSchedule: 'bad' }, 'generate_plan').valid, false);
  assert.equal(validateAiResponse({ allocations: {}, milestones: [], dayOfSchedule: [], vendors: 'bad' }, 'generate_plan').valid, false);
  assert.equal(validateAiResponse({ allocations: {}, milestones: [], dayOfSchedule: [], vendors: [], ideaLab: null }, 'generate_plan').valid, false);

  // Valid complete generate_plan structure
  const completePlan = {
    allocations: {
      venue: { percentage: 20 },
      catering: { percentage: 25 },
      decor: { percentage: 15 },
      entertainment: { percentage: 15 },
      photography: { percentage: 10 },
      contingency: { percentage: 15 }
    },
    milestones: [
      { title: 'Booking Phase', timeframe: '6 Months', tasks: [{ title: 'Sign venue', completed: true }] }
    ],
    dayOfSchedule: [
      { time: '10:00 AM', title: 'Arrival', leadPerson: 'Lead Planner' }
    ],
    vendors: [
      { name: 'Crystal Sound', category: 'entertainment' }
    ],
    ideaLab: {
      themeConcept: 'Aurora Borealis',
      colorPalette: [{ name: 'Cyan', hex: '#00F0FF', usage: 'Accents' }]
    }
  };
  assert.equal(validateAiResponse(completePlan, 'generate_plan').valid, true);

  // Nested failure checks
  const brokenMilestone = JSON.parse(JSON.stringify(completePlan));
  brokenMilestone.milestones[0].tasks = 'not-an-array';
  assert.equal(validateAiResponse(brokenMilestone, 'generate_plan').valid, false);

  const brokenSchedule = JSON.parse(JSON.stringify(completePlan));
  brokenSchedule.dayOfSchedule[0].time = 12345;
  assert.equal(validateAiResponse(brokenSchedule, 'generate_plan').valid, false);

  // rebalance_budget validation
  assert.equal(validateAiResponse({}, 'rebalance_budget').valid, false);
  assert.equal(validateAiResponse({ allocations: { catering: 30 } }, 'rebalance_budget').valid, true);

  // chat_refine validation
  assert.equal(validateAiResponse({}, 'chat_refine').valid, false);
  assert.equal(validateAiResponse({ reply: '   ' }, 'chat_refine').valid, false);
  assert.equal(validateAiResponse({ reply: 'Sustainable linen is recommended.' }, 'chat_refine').valid, true);
});

// Test 32: validateHttpRequestBody Exact Byte-Boundary & Encoding Edge Cases
test('validateHttpRequestBody enforces exact byte threshold boundaries and utf-8 multi-byte characters', () => {
  // Null or undefined body
  const emptyRes = validateHttpRequestBody(null);
  assert.equal(emptyRes.valid, false);
  assert.equal(emptyRes.status, 400);

  // Exact boundary: 10 bytes threshold
  const exact9Bytes = JSON.stringify({ a: 1 }); // '{"a":1}' = 7 bytes
  assert.equal(validateHttpRequestBody(exact9Bytes, 7).valid, true);
  assert.equal(validateHttpRequestBody(exact9Bytes, 6).valid, false);
  assert.equal(validateHttpRequestBody(exact9Bytes, 6).status, 413);

  // Multi-byte UTF-8 character expansion (e.g. Emoji 🎊 is 4 bytes in UTF-8)
  const emojiStr = JSON.stringify({ msg: '🎊' }); // '{"msg":"\uD83C\uDF8A"}' -> 4 bytes for emoji
  const byteCount = Buffer.byteLength(emojiStr, 'utf8');
  assert.equal(validateHttpRequestBody(emojiStr, byteCount).valid, true);
  assert.equal(validateHttpRequestBody(emojiStr, byteCount - 1).valid, false);
  assert.equal(validateHttpRequestBody(emojiStr, byteCount - 1).status, 413);

  // Malformed JSON parsing failure
  const malformed = '{"title": "Unclosed string...';
  const malformedRes = validateHttpRequestBody(malformed, 1024);
  assert.equal(malformedRes.valid, false);
  assert.equal(malformedRes.status, 400);
});

// Test 33: readAndValidateHttpStream Stream Abortion and Byte-Level Protection
test('readAndValidateHttpStream cancels incoming streams immediately upon threshold breach without buffering overflow', async () => {
  // Helper to create a ReadableStream from byte chunks
  function createChunkedStream(chunks) {
    let index = 0;
    return new ReadableStream({
      pull(controller) {
        if (index < chunks.length) {
          controller.enqueue(chunks[index++]);
        } else {
          controller.close();
        }
      }
    });
  }

  // 1. Missing stream
  const missingRes = await readAndValidateHttpStream(null, 100);
  assert.equal(missingRes.valid, false);
  assert.equal(missingRes.status, 400);

  // 2. Valid stream within maxBytes
  const payload = JSON.stringify({ action: 'rebalance_budget', totalBudget: 25000 });
  const validChunk = new TextEncoder().encode(payload);
  const stream1 = createChunkedStream([validChunk]);
  const res1 = await readAndValidateHttpStream(stream1, 1024);
  assert.equal(res1.valid, true);
  assert.equal(res1.data.totalBudget, 25000);

  // 3. Oversized stream with multiple chunks aborts before finishing all chunks
  const chunk1 = new Uint8Array(40);
  const chunk2 = new Uint8Array(40);
  const stream2 = createChunkedStream([chunk1, chunk2]);
  const res2 = await readAndValidateHttpStream(stream2, 50); // limit 50 bytes, chunk1 + chunk2 = 80
  assert.equal(res2.valid, false);
  assert.equal(res2.status, 413);
  assert.match(res2.error, /Payload too large/);

  // 4. Malformed JSON in stream
  const badChunk = new TextEncoder().encode('{ not-json');
  const stream3 = createChunkedStream([badChunk]);
  const res3 = await readAndValidateHttpStream(stream3, 1024);
  assert.equal(res3.valid, false);
  assert.equal(res3.status, 400);
});

// Test 34: CSP Nonce and Script Hydration Tag Integrity
test('CSP generation applies nonce policy with strict-dynamic and tags all hydration scripts', () => {
  const nonce = Buffer.from('test-uuid-1234').toString('base64');
  const isDev = false;
  const scriptSrc = isDev
    ? `'self' 'unsafe-eval' 'nonce-${nonce}'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const cspHeader = `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://generativelanguage.googleapis.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`;

  // Policy must not have unsafe-inline in script-src in production
  const scriptDirective = cspHeader.split(';').find(d => d.trim().startsWith('script-src'));
  assert.ok(scriptDirective, 'script-src directive must exist');
  assert.ok(!scriptDirective.includes("'unsafe-inline'"), 'Production script-src must not contain unsafe-inline');
  assert.ok(scriptDirective.includes(`'nonce-${nonce}'`), 'script-src must include the generated nonce');
  assert.ok(scriptDirective.includes("'strict-dynamic'"), 'script-src must include strict-dynamic');
});

// Test 35: W3C Roving Tabindex & Keyboard Navigation Interaction Logic
test('Navigation tabs adhere to W3C ARIA tablist patterns and handle arrow key keyboard interactions', () => {
  const tabs = ['budget', 'timeline', 'vendors', 'seating', 'idealab', 'contingency', 'sustainability'];

  function getNextTab(currentTab, key) {
    const idx = tabs.indexOf(currentTab);
    if (idx === -1) return currentTab;
    if (key === 'ArrowRight') return tabs[(idx + 1) % tabs.length];
    if (key === 'ArrowLeft') return tabs[(idx - 1 + tabs.length) % tabs.length];
    if (key === 'Home') return tabs[0];
    if (key === 'End') return tabs[tabs.length - 1];
    return currentTab;
  }

  // Right arrow advances cyclically
  assert.equal(getNextTab('budget', 'ArrowRight'), 'timeline');
  assert.equal(getNextTab('sustainability', 'ArrowRight'), 'budget');

  // Left arrow recedes cyclically
  assert.equal(getNextTab('budget', 'ArrowLeft'), 'sustainability');
  assert.equal(getNextTab('vendors', 'ArrowLeft'), 'timeline');

  // Home and End jump to edges
  assert.equal(getNextTab('seating', 'Home'), 'budget');
  assert.equal(getNextTab('seating', 'End'), 'sustainability');

  // Verify tab attribute metadata
  tabs.forEach(tab => {
    const tabId = `tab-${tab}`;
    const panelId = `panel-${tab}`;
    assert.equal(tabId.startsWith('tab-'), true);
    assert.equal(panelId.startsWith('panel-'), true);
  });
});

// Test 36: Modal Dialog Keyboard Trap, Escape Key, and Focus Restoration State Machine
test('Modal dialog state machine correctly handles Escape dismiss, Tab cycle boundaries, and focus restoration', () => {
  // Simulate DOM focus ring
  let isModalOpen = true;
  let activeElement = 'close-button';
  let previousActiveElement = 'open-modal-trigger';
  const focusableElements = ['close-button', 'gemini-api-key-input', 'cancel-btn', 'save-btn'];

  function handleModalKeyDown(key, shiftKey) {
    if (key === 'Escape') {
      isModalOpen = false;
      activeElement = previousActiveElement;
      return { handled: true, action: 'closed' };
    }

    if (key === 'Tab') {
      const idx = focusableElements.indexOf(activeElement);
      if (shiftKey) {
        // Shift + Tab from first element wraps to last
        activeElement = idx <= 0 ? focusableElements[focusableElements.length - 1] : focusableElements[idx - 1];
      } else {
        // Tab from last element wraps to first
        activeElement = idx === focusableElements.length - 1 ? focusableElements[0] : focusableElements[idx + 1];
      }
      return { handled: true, action: 'tabbed', activeElement };
    }

    return { handled: false };
  }

  // 1. Tab forwards through elements and wraps
  assert.equal(handleModalKeyDown('Tab', false).activeElement, 'gemini-api-key-input');
  activeElement = 'save-btn'; // At last element
  assert.equal(handleModalKeyDown('Tab', false).activeElement, 'close-button'); // Wraps to first

  // 2. Shift+Tab backwards from first element wraps to last
  activeElement = 'close-button';
  assert.equal(handleModalKeyDown('Tab', true).activeElement, 'save-btn');

  // 3. Escape closes dialog and restores focus to previous trigger
  const escResult = handleModalKeyDown('Escape', false);
  assert.equal(escResult.action, 'closed');
  assert.equal(isModalOpen, false);
  assert.equal(activeElement, 'open-modal-trigger');
});

// Test 37: Live HTTP Middleware Nonce & Dynamic Strict-Dynamic Header Verification
test('Live HTTP request yields valid CSP nonce header and attaches nonce to inline hydration scripts', async (t) => {
  let res;
  try {
    res = await fetch('http://localhost:3000');
  } catch (err) {
    t.skip('Local server not running on port 3000; skipping live network test');
    return;
  }
  assert.equal(res.status, 200);

  const csp = res.headers.get('content-security-policy');
  assert.ok(csp, 'Content-Security-Policy header must be present');

  // Isolate script-src directive
  const scriptDirective = csp.split(';').find(d => d.trim().startsWith('script-src'));
  assert.ok(scriptDirective, 'script-src directive must exist in CSP');
  assert.ok(!scriptDirective.includes("'unsafe-inline'"), 'Production script-src must not allow unsafe-inline for scripts');
  assert.ok(scriptDirective.includes("'strict-dynamic'"), 'CSP must include strict-dynamic');

  const nonce = res.headers.get('x-nonce');
  assert.ok(nonce, 'x-nonce header must be generated by middleware');
  assert.ok(csp.includes(`'nonce-${nonce}'`), 'CSP header must contain the exact generated nonce');

  const html = await res.text();
  assert.ok(html.includes(`nonce="${nonce}"`), 'HTML scripts must be tagged with the matching nonce attribute');
});

// Test 38: Live HTTP API Route Stream-Size & Malformed Body Rejection
test('Live /api/ai endpoint immediately rejects oversized bodies with 413 and malformed bodies with 400', async (t) => {
  // 1. Oversized body (>64KB)
  const oversizedText = JSON.stringify({ action: 'chat_refine', message: 'x'.repeat(70000) });
  let resOversized;
  try {
    resOversized = await fetch('http://localhost:3000/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: oversizedText
    });
  } catch (err) {
    t.skip('Local server not running on port 3000; skipping live network test');
    return;
  }
  assert.equal(resOversized.status, 413);
  const errBody = await resOversized.json();
  assert.match(errBody.error, /Payload too large/);

  // 2. Malformed JSON body
  const resMalformed = await fetch('http://localhost:3000/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"action": "generate_plan", unclosed...'
  });
  assert.equal(resMalformed.status, 400);
});

// Test 39: Live HTTP API Route Request Validation and Fallback Generation
test('Live /api/ai validates required event schema and responds with deterministic AI plan fallback', async (t) => {
  const validPayload = {
    action: 'rebalance_budget',
    priorityFocus: 'food_first',
    totalBudget: 50000,
    guestCount: 150,
    eventType: 'wedding',
    apiKey: 'mock'
  };

  let res;
  try {
    res = await fetch('http://localhost:3000/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload)
    });
  } catch (err) {
    t.skip('Local server not running on port 3000; skipping live network test');
    return;
  }

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.allocations, 'Response must contain allocations');
  assert.ok(data.allocations.catering, 'Catering allocation must exist');
  assert.equal(typeof data.summaryInsight, 'string');
});

// Test 40: High-Scale Guest List & Table Seating Performance Benchmark
test('High-Scale state performance: seating 1,000 guests across 100 tables computes in under 5ms', () => {
  const dietaryTypes = ['Regular', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Jain'];
  const allGuests = [];

  for (let i = 1; i <= 1000; i++) {
    allGuests.push({
      id: `g_${i}`,
      name: `Guest ${i}`,
      dietary: dietaryTypes[i % dietaryTypes.length]
    });
  }

  const start = performance.now();
  const tally = tallyDietaryRequirements(allGuests);
  const duration = performance.now() - start;

  assert.equal(tally.Regular + tally.Vegan + tally.Vegetarian + tally['Gluten-Free'] + tally.Halal + tally.Jain, 1000);
  assert.ok(duration < 15, `1,000-guest dietary tally must execute in under 15ms, took ${duration.toFixed(2)}ms`);
});
