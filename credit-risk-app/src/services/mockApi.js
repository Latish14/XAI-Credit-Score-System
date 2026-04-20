/**
 * mockApi.js — Local fallback when the backend is unreachable.
 *
 * Returns a plausible mock prediction so the UI always renders results,
 * even if the backend is cold-starting or offline.
 */

export function predictRisk(formData) {
  const ficoScore = parseFloat(formData.ficoScore) || 650
  const dti = parseFloat(formData.dti) || 20
  const loanAmount = parseFloat(formData.loanAmount) || 10000
  const annualIncome = parseFloat(formData.annualIncome) || 60000
  const intRate = parseFloat(formData.intRate) || 13.5
  const empLength = parseFloat(formData.empLength) || 5
  const creditHistory = parseFloat(formData.creditHistory) || 10

  let prob = 0.5
  prob -= (ficoScore - 650) * 0.003
  prob += (dti - 15) * 0.01
  prob += (loanAmount / annualIncome - 0.3) * 0.2
  prob += (intRate - 12) * 0.015
  prob -= empLength * 0.01
  prob -= creditHistory * 0.005
  prob = Math.max(0.02, Math.min(0.98, prob))

  const prediction = prob >= 0.5 ? 'Default' : 'No Default'

  const shapValues = [
    { feature: 'FICO Score', value: +(ficoScore > 700 ? -0.15 : 0.12).toFixed(4), impact: ficoScore > 700 ? 'positive' : 'negative' },
    { feature: 'Debt To Income', value: +(dti > 20 ? 0.09 : -0.06).toFixed(4), impact: dti > 20 ? 'negative' : 'positive' },
    { feature: 'Loan Amount', value: +(loanAmount > 20000 ? 0.07 : -0.04).toFixed(4), impact: loanAmount > 20000 ? 'negative' : 'positive' },
    { feature: 'Annual Income', value: +(annualIncome > 70000 ? -0.08 : 0.05).toFixed(4), impact: annualIncome > 70000 ? 'positive' : 'negative' },
    { feature: 'Interest Rate', value: +(intRate > 15 ? 0.10 : -0.03).toFixed(4), impact: intRate > 15 ? 'negative' : 'positive' },
    { feature: 'Employment Length', value: +(empLength >= 5 ? -0.06 : 0.04).toFixed(4), impact: empLength >= 5 ? 'positive' : 'negative' },
    { feature: 'Credit History', value: +(creditHistory > 8 ? -0.05 : 0.03).toFixed(4), impact: creditHistory > 8 ? 'positive' : 'negative' },
  ]

  const explanation =
    `This applicant has a ${(prob * 100).toFixed(1)}% probability of default, ` +
    `indicating ${prediction === 'Default' ? 'higher' : 'lower'} credit risk. ` +
    `Key factors include a FICO score of ${ficoScore}, ` +
    `a debt-to-income ratio of ${dti}%, ` +
    `and ${empLength} years of employment history. ` +
    `(Note: this is a local estimate — the backend may be warming up.)`

  const riskScore = Math.round(prob * 100)

  return {
    prediction,
    probability: +prob.toFixed(4),
    risk_score: riskScore,
    model_used: 'Local heuristic (offline)',
    shapValues,
    explanation,
  }
}
