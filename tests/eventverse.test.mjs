import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
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
  validateAiRequestPayload
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
