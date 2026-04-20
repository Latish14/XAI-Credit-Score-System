/**
 * mockApi.js — Simulates the FastAPI /predict endpoint.
 *
 * WHAT THIS FILE DOES:
 * Instead of calling a real server, this function takes the form data,
 * runs some simple math to produce a *fake* prediction, and returns it
 * after a short delay (to feel like a real network call).
 *
 * LATER: Replace `predictRisk()` with a real `fetch('/predict', ...)` call.
 */

// Helper: clamp a number between min and max
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/**
 * Simulate a credit-risk prediction.
 * @param {Object} data - form fields
 * @returns {Promise<Object>} - prediction result
 */
export function predictRisk(data) {
  return new Promise((resolve) => {
    // Simulate network delay (600–1200 ms)
    const delay = 600 + Math.random() * 600;

    setTimeout(() => {
      // --- Simple scoring logic (not real ML, just plausible) ---
      const fico          = Number(data.ficoScore);
      const income        = Number(data.annualIncome);
      const loanAmount    = Number(data.loanAmount);
      const dti           = Number(data.dti);
      const empLength     = Number(data.empLength);
      const creditHistory = Number(data.creditHistory);

      // Higher FICO, higher income, lower DTI → lower risk
      let riskScore = 0.5; // start neutral

      // FICO impact (300-850 range)
      riskScore -= (fico - 650) / 400;  // good FICO lowers risk

      // DTI impact
      riskScore += (dti - 20) / 80;     // high DTI raises risk

      // Loan-to-income ratio
      const lti = loanAmount / Math.max(income, 1);
      riskScore += (lti - 0.3) * 0.5;

      // Employment length benefit
      riskScore -= empLength * 0.015;

      // Credit history benefit
      riskScore -= creditHistory * 0.01;

      // Clamp probability to [0.02, 0.98]
      const probability = clamp(riskScore, 0.02, 0.98);
      const prediction  = probability >= 0.5 ? 'Default' : 'No Default';

      // --- SHAP-like feature importance values ---
      const shapValues = [
        {
          feature: 'FICO Score',
          value: -((fico - 650) / 400) * 0.3,
          impact: fico >= 700 ? 'positive' : 'negative',
        },
        {
          feature: 'Debt-to-Income',
          value: ((dti - 20) / 80) * 0.25,
          impact: dti <= 25 ? 'positive' : 'negative',
        },
        {
          feature: 'Loan Amount',
          value: (lti - 0.3) * 0.2,
          impact: lti <= 0.3 ? 'positive' : 'negative',
        },
        {
          feature: 'Annual Income',
          value: -(income / 200000) * 0.15,
          impact: income >= 60000 ? 'positive' : 'negative',
        },
        {
          feature: 'Employment Length',
          value: -(empLength * 0.015) * 0.5,
          impact: empLength >= 3 ? 'positive' : 'negative',
        },
        {
          feature: 'Credit History',
          value: -(creditHistory * 0.01) * 0.4,
          impact: creditHistory >= 5 ? 'positive' : 'negative',
        },
      ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

      // --- Natural-language explanation ---
      const topPositive = shapValues.filter((s) => s.impact === 'positive');
      const topNegative = shapValues.filter((s) => s.impact === 'negative');

      let explanation = '';
      if (prediction === 'No Default') {
        explanation = `The model predicts this borrower is unlikely to default (${(probability * 100).toFixed(1)}% risk). `;
        if (topPositive.length)
          explanation += `Key strengths include ${topPositive.map((s) => s.feature).join(', ')}. `;
        if (topNegative.length)
          explanation += `Areas of concern: ${topNegative.map((s) => s.feature).join(', ')}.`;
      } else {
        explanation = `The model predicts a higher risk of default (${(probability * 100).toFixed(1)}% risk). `;
        if (topNegative.length)
          explanation += `Primary risk drivers are ${topNegative.map((s) => s.feature).join(', ')}. `;
        if (topPositive.length)
          explanation += `Mitigating factors: ${topPositive.map((s) => s.feature).join(', ')}.`;
      }

      resolve({
        prediction,
        probability: parseFloat(probability.toFixed(4)),
        shapValues,
        explanation,
      });
    }, delay);
  });
}
