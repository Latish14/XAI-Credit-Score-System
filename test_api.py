from main import predict, LoanInput

data = LoanInput(
    loan_amnt=25000,
    annual_inc=85000,
    int_rate=13.5,
    dti=18.5,
    fico_range_low=720,
    fico_range_high=724,
    emp_length="6 years",
    credit_history_length=144,
    term="36 months",
    model_choice="xgboost"
)

try:
    resp = predict(data)
    print("XGBoost Prediction:", resp.prediction)
    print("Probability:", resp.probability)
except Exception as e:
    print("Error:", str(e))

data.model_choice = "logistic_regression"
try:
    resp = predict(data)
    print("Logistic Regression Prediction:", resp.prediction)
    print("Probability:", resp.probability)
except Exception as e:
    print("Error:", str(e))
