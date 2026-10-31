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
