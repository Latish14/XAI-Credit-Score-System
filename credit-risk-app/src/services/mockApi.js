const API_URL = "https://xai-credit-score-system.onrender.com";

export const predictRisk = async (form) => {
  try {
    // ✅ FIXED mapping
    const formattedData = {
      loan_amnt: Number(form.loan_amount),
      int_rate: Number(form.int_rate),
      annual_inc: Number(form.annual_income),
      dti: Number(form.dti),
      fico_range_low: Number(form.fico_score),

      // safe defaults (optional fields)
      term: "36 months",
      grade: "B",
      home_ownership: "RENT",
      verification_status: "Verified",
      purpose: "debt_consolidation"
    };

    console.log("Sending to backend:", formattedData);

    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Backend error:", result);
      throw new Error("API error");
    }

    return {
      prediction: result.prediction,
      probability: result.probability,
      riskScore: result.risk_score,
      shapValues: result.shap_features,
      explanation: result.explanation_text,
    };

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
