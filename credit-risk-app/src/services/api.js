/**
 * api.js — Unified API service.
 *
 * - Local dev: http://127.0.0.1:8000
 * - Production build: https://xai-credit-score-system.onrender.com unless VITE_API_URL is set
 * Falls back to mock only on network / timeout (offline or cold start).
 */

import { predictRisk as mockPredict } from './mockApi'

const DEFAULT_PROD_API = 'https://xai-credit-score-system.onrender.com'

function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_URL
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).replace(/\/$/, '')
  }
  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8000'
  }
  return DEFAULT_PROD_API.replace(/\/$/, '')
}

const API_BASE = resolveApiBase()
const TIMEOUT_MS = 30000

const FEATURE_LABELS = {
  loan_amnt: 'Loan Amount',
  funded_amnt: 'Funded Amount',
  funded_amnt_inv: 'Investor Funded Amount',
  int_rate: 'Interest Rate',
  installment: 'Installment',
  annual_inc: 'Annual Income',
  dti: 'Debt To Income',
  delinq_2yrs: 'Delinquencies (2 yrs)',
  fico_range_low: 'FICO Score (low)',
  fico_range_high: 'FICO Score (high)',
  inq_last_6mths: 'Inquiries (6 mo)',
  open_acc: 'Open Accounts',
  pub_rec: 'Public Records',
  revol_bal: 'Revolving Balance',
  revol_util: 'Revolving Utilization',
  total_acc: 'Total Accounts',
  credit_history_length: 'Credit History (months)',
}

function formatFeatureName(name) {
  if (FEATURE_LABELS[name]) return FEATURE_LABELS[name]
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatEmpLength(years) {
  const y = Math.round(Number(years))
  if (!Number.isFinite(y) || y < 0) return '4 years'
  if (y >= 10) return '10+ years'
  if (y <= 1) return '1 year'
  return `${y} years`
}

function buildPayload(form) {
  const loanAmount = parseFloat(form.loanAmount) || 0
  const annualIncome = parseFloat(form.annualIncome) || 0
  const dti = parseFloat(form.dti) || 0
  const ficoScore = parseFloat(form.ficoScore) || 650
  const empLength = parseFloat(form.empLength) || 0
  const creditHistory = parseFloat(form.creditHistory) || 0
  const rawRate = parseFloat(form.intRate)
  const intRate = Number.isFinite(rawRate) ? rawRate : 13.5

  return {
    loan_amnt: loanAmount,
    funded_amnt: loanAmount,
    funded_amnt_inv: loanAmount,
    int_rate: intRate,
    installment: Math.round(loanAmount * 0.03 * 100) / 100,
    annual_inc: annualIncome,
    dti,
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
    sub_grade: 'B3',
    emp_length: formatEmpLength(empLength),
    home_ownership: 'RENT',
    verification_status: 'Verified',
    purpose: 'debt_consolidation',
    model_choice: 'xgboost',
  }
}

function isLikelyNetworkError(err) {
  if (!err) return false
  if (err.name === 'AbortError') return true
  if (err.name === 'TypeError') return true
  const msg = String(err.message || err)
  return /failed to fetch|network|load failed|aborted|abort/i.test(msg)
}

function normaliseBackendResponse(raw) {
  const shapList = raw.shap_features || []
  return {
    prediction: raw.prediction,
    probability: raw.probability,
    risk_score: raw.risk_score,
    model_used: raw.model_used,
    shapValues: shapList.map((f) => ({
      feature: formatFeatureName(f.feature),
      value: f.shap_value,
      impact: f.shap_value > 0 ? 'negative' : 'positive',
    })),
    explanation: raw.explanation_text || '',
  }
}

export async function predictRisk(formData) {
  const payload = buildPayload(formData)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res
  try {
    res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    if (isLikelyNetworkError(err)) {
      if (import.meta.env.DEV) {
        console.warn('Backend unreachable, using local mock:', err.message)
      }
      return mockPredict(formData)
    }
    throw err
  }

  clearTimeout(timer)

  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (typeof body?.detail === 'string') detail = body.detail
      else if (body?.detail != null) detail = JSON.stringify(body.detail)
    } catch {
      const text = await res.text().catch(() => '')
      if (text) detail = text.slice(0, 500)
    }
    throw new Error(detail)
  }

  const data = await res.json()
  if (import.meta.env.DEV) {
    console.log('Backend response:', data)
  }
  return normaliseBackendResponse(data)
}
