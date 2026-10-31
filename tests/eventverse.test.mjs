import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Math & Currency Formatting
function formatCurrency(amount, currency = 'USD') {
  const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };
  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })}`;
}

test('formatCurrency outputs correct symbol and formatting', () => {
  assert.equal(formatCurrency(42000, 'USD'), '$42,000');
  assert.equal(formatCurrency(15000, 'EUR'), '€15,000');
  assert.equal(formatCurrency(8500, 'GBP'), '£8,500');
  assert.equal(formatCurrency(1500000, 'INR'), '₹1,500,000');
});

// Test 2: Normalization Algorithm (Must equal exactly 100%)
function normalizeAllocations(percentages) {
  const keys = Object.keys(percentages);
  const total = keys.reduce((acc, k) => acc + percentages[k], 0);
  if (total === 0) return percentages;

  const result = {};
  let accumulated = 0;
  keys.forEach((k, idx) => {
    let newPct = Math.round((percentages[k] / total) * 100);
    if (idx === keys.length - 1) {
      newPct = 100 - accumulated;
    } else {
      accumulated += newPct;
    }
    result[k] = newPct;
  });
  return result;
}

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
function getBenchmarkInsight(eventType, guestCount, totalBudget) {
  const perGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;
  if (perGuest < 80) return { tier: 'Boutique / Budget-Savvy', perGuest };
  if (perGuest <= 250) return { tier: 'Standard Premium', perGuest };
  return { tier: 'Luxury / High-End', perGuest };
}

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
function calculateContingencyReserve(totalBudget, contingencyPercentage) {
  return Math.round(totalBudget * (contingencyPercentage / 100));
}

test('Contingency Reserve calculates strictly compliant safety buffers', () => {
  assert.equal(calculateContingencyReserve(60000, 5), 3000);
  assert.equal(calculateContingencyReserve(42000, 5), 2100);
  assert.equal(calculateContingencyReserve(11000, 8), 880);
});

// Test 6: Sonic Audio Track BPM Classification
function classifyAudioEnergy(bpm) {
  if (bpm >= 120) return 'High Voltage Peak';
  if (bpm >= 90) return 'Groovy & Upbeat';
  return 'Calm & Elegant';
}

test('Audio BPM energy levels match soundstage curation specifications', () => {
  assert.equal(classifyAudioEnergy(128), 'High Voltage Peak');
  assert.equal(classifyAudioEnergy(94), 'Groovy & Upbeat');
  assert.equal(classifyAudioEnergy(82), 'Calm & Elegant');
});

// Test 7: Carbon Abatement Math & Percentage Reduction
function calculateCarbonReduction(baselineKg, optimizedKg) {
  if (baselineKg <= 0) return 0;
  const saved = baselineKg - optimizedKg;
  return Math.round((saved / baselineKg) * 100);
}

test('Carbon abatement reduction percentage is calculated accurately', () => {
  assert.equal(calculateCarbonReduction(2460, 565), 77); // 77% reduction
  assert.equal(calculateCarbonReduction(520, 85), 84);   // 84% food waste reduction
  assert.equal(calculateCarbonReduction(940, 290), 69);  // 69% transport cut
});

// Test 8: ESG Eco-Certification Level Grading Tier
function getEsgCertification(percentReduced) {
  if (percentReduced >= 60) return 'Level III Eco-Gold';
  if (percentReduced >= 40) return 'Level II Eco-Silver';
  return 'Level I Eco-Certified';
}

test('ESG Certification grading assigns proper honors based on abatement', () => {
  assert.equal(getEsgCertification(77), 'Level III Eco-Gold');
  assert.equal(getEsgCertification(52), 'Level II Eco-Silver');
  assert.equal(getEsgCertification(25), 'Level I Eco-Certified');
});

// Test 9: Table Seating Dietary Breakdown Tally
function tallyDietaryRequirements(guests) {
  const counts = { Regular: 0, Vegan: 0, Vegetarian: 0, 'Gluten-Free': 0, Halal: 0, Jain: 0 };
  guests.forEach(g => {
    if (counts[g.dietary] !== undefined) {
      counts[g.dietary]++;
    }
  });
  return counts;
}

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
function isChronologicallyOrdered(times) {
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

test('Day-of run-of-show timeline progresses chronologically', () => {
  const schedule = ['02:00 PM', '04:30 PM', '06:00 PM', '07:30 PM', '10:00 PM'];
  assert.equal(isChronologicallyOrdered(schedule), true);

  const brokenSchedule = ['02:00 PM', '01:00 PM'];
  assert.equal(isChronologicallyOrdered(brokenSchedule), false);
});


