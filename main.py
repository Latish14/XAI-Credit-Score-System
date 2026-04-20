"""
FastAPI Backend — XAI Credit Scoring System
Models: XGBoost (primary), Logistic Regression (secondary)
Explainability: SHAP + LIME
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import numpy as np
import pandas as pd
import joblib
import shap
import lime
import lime.lime_tabular
import warnings
import os

warnings.filterwarnings("ignore")

# ──────────────────────────────────────────────
# App Setup
# ──────────────────────────────────────────────
app = FastAPI(
    title="XAI Credit Scoring API",
    description="Credit risk prediction with SHAP and LIME explanations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Load models (resolve path relative to this file)
# ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

xgb_model  = joblib.load(os.path.join(BASE_DIR, "xgb_model.pkl"))
lr_model   = joblib.load(os.path.join(BASE_DIR, "lr_model.pkl"))
scaler     = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))

# All 200 features the model was trained on
FEATURE_NAMES: list[str] = xgb_model.get_booster().feature_names

# Key numeric features accepted directly from the user form
NUMERIC_INPUTS = [
    "loan_amnt", "funded_amnt", "funded_amnt_inv",
    "int_rate", "installment", "annual_inc", "dti",
    "delinq_2yrs", "fico_range_low", "fico_range_high",
    "inq_last_6mths", "open_acc", "pub_rec",
    "revol_bal", "revol_util", "total_acc",
    "credit_history_length",
]

# SHAP background data — built once at startup from a zero-vector baseline
# (Replace with a real sample_data.csv if available for better explanations)
_bg = pd.DataFrame(
    np.zeros((50, len(FEATURE_NAMES))), columns=FEATURE_NAMES
)
SHAP_EXPLAINER = shap.Explainer(xgb_model, _bg)
LIME_EXPLAINER = lime.lime_tabular.LimeTabularExplainer(
    training_data=_bg.values,
    feature_names=FEATURE_NAMES,
    class_names=["Repaid", "Defaulted"],
    mode="classification",
)


# ──────────────────────────────────────────────
# Pydantic Schemas
# ──────────────────────────────────────────────
class LoanInput(BaseModel):
    # Core numeric features
    loan_amnt:              float = Field(..., example=10000)
    funded_amnt:            Optional[float] = None
    funded_amnt_inv:        Optional[float] = None
    int_rate:               float = Field(..., example=13.5)
    installment:            Optional[float] = None
    annual_inc:             float = Field(..., example=60000)
    dti:                    float = Field(..., example=18.5)
    delinq_2yrs:            Optional[float] = Field(default=0)
    fico_range_low:         float = Field(..., example=680)
    fico_range_high:        Optional[float] = None
    inq_last_6mths:         Optional[float] = Field(default=0)
    open_acc:               Optional[float] = Field(default=10)
    pub_rec:                Optional[float] = Field(default=0)
    revol_bal:              Optional[float] = Field(default=5000)
    revol_util:             Optional[float] = Field(default=40.0)
    total_acc:              Optional[float] = Field(default=20)
    credit_history_length:  Optional[float] = Field(default=60)

    # Categorical (user-facing)
    term:                   Optional[str]  = Field(default="36 months",  example="36 months")
    grade:                  Optional[str]  = Field(default="B",          example="B")
    sub_grade:              Optional[str]  = Field(default="B3",         example="B3")
    emp_length:             Optional[str]  = Field(default="5 years",    example="5 years")
    home_ownership:         Optional[str]  = Field(default="RENT",       example="RENT")
    verification_status:    Optional[str]  = Field(default="Verified",   example="Verified")
    purpose:                Optional[str]  = Field(default="debt_consolidation", example="debt_consolidation")
    addr_state:             Optional[str]  = Field(default="CA",         example="CA")
    initial_list_status:    Optional[str]  = Field(default="f",          example="f")
    application_type:       Optional[str]  = Field(default="Individual", example="Individual")
    disbursement_method:    Optional[str]  = Field(default="Cash",       example="Cash")

    model_choice: str = Field(default="xgboost", example="xgboost")


class ShapFeature(BaseModel):
    feature: str
    value:   float
    shap_value: float


class LimeFeature(BaseModel):
    feature:    str
    impact:     float
    direction:  str          # "increases_default" | "decreases_default"


class PredictionResponse(BaseModel):
    prediction:      str          # "Default" | "No Default"
    probability:     float        # probability of default  (0–1)
    risk_score:      int          # 0–100 (higher = riskier)
    model_used:      str
    shap_features:   list[ShapFeature]
    lime_features:   list[LimeFeature]
    explanation_text: str


# ──────────────────────────────────────────────
# Feature Engineering
# ──────────────────────────────────────────────
def _build_feature_vector(data: LoanInput) -> pd.DataFrame:
    """Convert LoanInput → DataFrame with all 200 model features."""
    row = {f: 0.0 for f in FEATURE_NAMES}

    # Numeric direct-map
    numeric_map = {
        "loan_amnt":             data.loan_amnt,
        "funded_amnt":           data.funded_amnt  or data.loan_amnt,
        "funded_amnt_inv":       data.funded_amnt_inv or data.loan_amnt,
        "int_rate":              data.int_rate,
        "installment":           data.installment  or round(data.loan_amnt * 0.03, 2),
        "annual_inc":            data.annual_inc,
        "dti":                   data.dti,
        "delinq_2yrs":           data.delinq_2yrs or 0,
        "fico_range_low":        data.fico_range_low,
        "fico_range_high":       data.fico_range_high or data.fico_range_low + 4,
        "inq_last_6mths":        data.inq_last_6mths or 0,
        "open_acc":              data.open_acc or 10,
        "pub_rec":               data.pub_rec or 0,
        "revol_bal":             data.revol_bal or 5000,
        "revol_util":            data.revol_util or 40.0,
        "total_acc":             data.total_acc or 20,
        "credit_history_length": data.credit_history_length or 60,
    }
    row.update(numeric_map)

    # term (one-hot: only " 60 months" flagged; 36 months = all zeros)
    if data.term and "60" in data.term:
        row["term_ 60 months"] = 1

    # grade
    if data.grade and data.grade != "A":
        key = f"grade_{data.grade.upper()}"
        if key in row:
            row[key] = 1

    # sub_grade
    if data.sub_grade:
        key = f"sub_grade_{data.sub_grade.upper()}"
        if key in row:
            row[key] = 1

    # emp_length
    if data.emp_length:
        key = f"emp_length_{data.emp_length}"
        if key in row:
            row[key] = 1

    # home_ownership
    if data.home_ownership:
        key = f"home_ownership_{data.home_ownership.upper()}"
        if key in row:
            row[key] = 1

    # verification_status
    if data.verification_status and data.verification_status != "Not Verified":
        key = f"verification_status_{data.verification_status}"
        if key in row:
            row[key] = 1

    # purpose
    if data.purpose:
        key = f"purpose_{data.purpose.lower()}"
        if key in row:
            row[key] = 1

    # addr_state
    if data.addr_state:
        key = f"addr_state_{data.addr_state.upper()}"
        if key in row:
            row[key] = 1

    # initial_list_status
    if data.initial_list_status and data.initial_list_status.lower() == "w":
        row["initial_list_status_w"] = 1

    # application_type
    if data.application_type and data.application_type == "Joint App":
        row["application_type_Joint App"] = 1

    # disbursement_method
    if data.disbursement_method and data.disbursement_method == "DirectPay":
        row["disbursement_method_DirectPay"] = 1

    return pd.DataFrame([row], columns=FEATURE_NAMES)


def _generate_explanation_text(prediction: str, probability: float,
                                shap_features: list[ShapFeature]) -> str:
    """Build a short natural-language explanation from top SHAP features."""
    top = sorted(shap_features, key=lambda x: abs(x.shap_value), reverse=True)[:3]

    direction = "higher" if prediction == "Default" else "lower"
    lines = [
        f"This applicant has a {probability*100:.1f}% probability of default, "
        f"indicating {direction} credit risk."
    ]

    for feat in top:
        sign = "increases" if feat.shap_value > 0 else "decreases"
        lines.append(
            f"• {feat.feature.replace('_', ' ').title()} "
            f"({feat.value:.2f}) {sign} default risk "
            f"(SHAP: {feat.shap_value:+.3f})."
        )

    return " ".join(lines)


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "XAI Credit Scoring API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": ["xgboost", "logistic_regression"]}


@app.get("/features")
def get_features():
    """Return the list of all model features (useful for frontend dev)."""
    return {"features": FEATURE_NAMES, "count": len(FEATURE_NAMES)}


@app.post("/predict", response_model=PredictionResponse)
def predict(data: LoanInput):
    try:
        X = _build_feature_vector(data)

        # ── Model selection ──
        model_name = data.model_choice.lower()
        if model_name == "logistic_regression":
            X_scaled = scaler.transform(X)
            prob_default = float(lr_model.predict_proba(X_scaled)[0][1])
            used_model = "Logistic Regression"
        else:
            prob_default = float(xgb_model.predict_proba(X)[0][1])
            used_model = "XGBoost"

        prediction = "Default" if prob_default >= 0.5 else "No Default"
        risk_score  = int(prob_default * 100)

        # ── SHAP ──
        shap_values = SHAP_EXPLAINER(X)
        sv = shap_values.values[0]                 # shape (200,)
        shap_df = pd.DataFrame({
            "feature":    FEATURE_NAMES,
            "value":      X.iloc[0].values,
            "shap_value": sv,
        })
        top_shap = (
            shap_df.reindex(shap_df["shap_value"].abs().sort_values(ascending=False).index)
            .head(10)
        )
        shap_features = [
            ShapFeature(
                feature=row["feature"],
                value=float(row["value"]),
                shap_value=float(row["shap_value"]),
            )
            for _, row in top_shap.iterrows()
        ]

        # ── LIME ──
        lime_exp = LIME_EXPLAINER.explain_instance(
            data_row=X.iloc[0].values,
            predict_fn=xgb_model.predict_proba,
            num_features=10,
        )
        lime_features = []
        for feat_label, impact in lime_exp.as_list():
            # Map raw LIME labels back to friendly feature names
            matched = next(
                (f for f in FEATURE_NAMES if f in feat_label), feat_label
            )
            lime_features.append(
                LimeFeature(
                    feature=matched.replace("_", " ").title(),
                    impact=round(float(impact), 4),
                    direction="increases_default" if impact < 0 else "decreases_default",
                )
            )

        explanation_text = _generate_explanation_text(
            prediction, prob_default, shap_features
        )

        return PredictionResponse(
            prediction=prediction,
            probability=round(prob_default, 4),
            risk_score=risk_score,
            model_used=used_model,
            shap_features=shap_features,
            lime_features=lime_features,
            explanation_text=explanation_text,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
