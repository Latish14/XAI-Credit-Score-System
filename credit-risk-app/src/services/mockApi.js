const API_URL = "https://xai-credit-score-system.onrender.com";

export const predictRisk = async (data) => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const result = await response.json();

    // 🔁 Map backend response → your frontend format
    return {
      prediction: result.prediction,
      probability: result.probability,
      riskScore: result.risk_score,
      shapValues: result.shap_features,
      explanation: result.explanation_text,
    };

  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
};
