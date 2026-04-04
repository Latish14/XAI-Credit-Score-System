import pandas as pd

df = pd.read_csv("loan_ml_ready_dataset.csv")

sample_df = df.sample(1000, random_state=42)

sample_df.to_csv("sample_data.csv", index=False)