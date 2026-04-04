# XAI-Credit-Scoring-System
📊 Credit Risk Prediction & Explainable AI System
🚀 Project Overview

This project builds an end-to-end Credit Risk Prediction System that predicts whether a borrower is likely to repay a loan or default using machine learning models.

It also integrates Explainable AI (XAI) techniques to provide transparent and interpretable predictions, making the system more reliable for real-world financial applications.

🎯 Objectives
Predict loan default risk using historical borrower data
Compare multiple ML models (Logistic Regression, XGBoost)
Provide explainability using SHAP and LIME
Build a full-stack system with FastAPI backend and React frontend
Enable real-time prediction with explanation

📊 Dataset
Dataset: Lending Club Loan Data
Rows: ~2.2 Million
Columns: 151 (reduced after preprocessing)
Key Features Used:
Loan Amount
Annual Income
Debt-to-Income Ratio (DTI)
FICO Score
Employment Length
Credit History Length
🧹 Data Preprocessing
Removed irrelevant and leakage columns
Handled missing values

🤖 Machine Learning Models
1️⃣ Logistic Regression
Simple baseline model
Easy to interpret
2️⃣ XGBoost
High performance
Handles non-linearity
Works well with large datasets
📈 Model Evaluation

Metrics used:
Accuracy
Precision
Recall
F1 Score
ROC-AUC

🧠 Explainable AI (XAI)
SHAP (SHapley Additive Explanations)
Provides global feature importance
Explains contribution of each feature
Visualizations:
Summary Plot
Feature Importance Plot
Force Plot
LIME (Local Interpretable Model-Agnostic Explanations)
Explains individual predictions
Shows local feature contribution
⚙️ Backend (FastAPI)
Loads trained ML model
Accepts user input
Returns prediction + explanation

Example API endpoint:
POST /predict
🌐 Frontend (React)
User input form
Displays:
Prediction (Default / No Default)
Risk score
Feature importance
🔄 Workflow
User Input → React UI → FastAPI → ML Model → SHAP/LIME → Response → UI Display
📌 Key Insights
Higher DTI ratio → Higher default risk
Lower income → Higher risk
Longer credit history → Lower risk
Loan grade strongly correlates with default

💡 Technologies Used
Python
Pandas, NumPy
Scikit-learn
XGBoost
SHAP, LIME
FastAPI
React

🏁 Future Improvements
Model optimization & hyperparameter tuning
Real-time SHAP dashboard
Deployment on cloud (AWS / GCP)
Model monitoring and drift detection
👨‍💻 Author

Pratyush Mishra
B.Tech CSE (Data Science)
⭐ Summary
This project demonstrates a complete Machine Learning pipeline + Explainable AI + Full Stack deployment, making it highly relevant for real-world financial applications.

If you want, I can also:
🔥 Upgrade this README to top-tier (resume-level + recruiter optimized)
📊 Add badges, screenshots, and demo sections
🚀 Write a perfect GitHub description + tags for visibility
Converted categorical variables using encoding
Feature engineering (credit history, ratios)
Normalization using scaler
