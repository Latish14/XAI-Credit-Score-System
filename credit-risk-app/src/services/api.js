/**
 * api.js — Unified API service.
 */

import { predictRisk as mockPredict } from './mockApi'

const API_BASE = 'https://xai-credit-score-system.onrender.com'
const TIMEOUT_MS = 20000 // 🔥 increased timeout (Render cold start)

/**
 * Map frontend → backend
 */
function buildPayload(form) {
  console.log("FORM DATA:", form) // 🔍 DEBUG

  const loanAmount = parseFloat(form.loanAmount) || 0
  const annualIncome = parseFloat(form.annualIncome) || 0
  const dti = parseFloat(form.dti) || 0
  const ficoScore = parseFloat(form.ficoScore) || 650
  const empLength = parseFloat(form.empLength) || 0
  const creditHistory = parseFloat(form.creditHistory) || 0

  // 🔥 FIX: ensure interest rate NEVER becomes NaN
  const intRate = parseFloat(form.intRate)
  const safeRate = isNaN(intRate) ? 13.5 : intRate

  const payload = {
    loan_amnt: loanAmount,
    funded_amnt: loanAmount,
    funded_amnt_inv: loanAmount,
    int_rate: safeRate,   // ✅ FIXED
    installment: Math.round(loanAmount * 0.03 * 100) / 100,
    annual_inc: annualIncome,
    dti: dti,
    delinq_2yrs: 0,
    fico_range_low: ficoScore,
    fico_range_high: ficoScore + 4,
    inq_last_6mths: 0,
    open_acc: 10,
    pub_rec: 0,
    revol_bal: 5000,
    revol_util: 40.0,
    total_acc: 20,
    credit_history_length: creditHistory * 12,
    term: '36 months',
    grade: ficoScore >= 740 ? 'A' : ficoScore >= 700 ? 'B' : ficoScore >= 660 ? 'C' : 'D',
    emp_length: empLength >= 10 ? '10+ years' : `${Math.round(empLength)} years`,
    home_ownership: 'RENT',
    verification_status: 'Verified',
    purpose: 'debt_consolidation',
    model_choice: 'xgboost',
  }

  console.log("FINAL PAYLOAD:", payload) // 🔍 DEBUG

  return payload
}

/**
 * Normalize response
 */
function normaliseBackendResponse(raw) {
  return {
    prediction: raw.prediction,
    probability: raw.probability,
    shapValues: (raw.shap_features || []).map(f => ({
      feature: f.feature.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: f.shap_value,
      impact: f.shap_value > 0 ? 'negative' : 'positive',
    })),
    explanation: raw.explanation_text || '',
  }
}

/**
 * Main API call
 */
export async function predictRisk(formData) {
  try {
    const payload = buildPayload(formData)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timer)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.warn('Backend error:', err)
      throw new Error('API failed')
    }

    const data = await res.json()
    return normaliseBackendResponse(data)

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Render backend may be sleeping — try again in 30 seconds.')
    }
    throw new Error(err.message || 'Prediction failed')
  }
