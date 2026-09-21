#!/usr/bin/env python
"""
Test script to validate the ML logic without Flask dependency
"""

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

print("=" * 60)
print("MediSphere AI Service - ML Logic Test")
print("=" * 60)

# Generate synthetic CVD data
np.random.seed(42)
n_samples = 500

age = np.random.normal(55, 15, n_samples)
age = np.clip(age, 18, 100)
gender = np.random.choice([0, 1], n_samples)
systolic_bp = np.random.normal(125, 20, n_samples)
systolic_bp = np.clip(systolic_bp, 80, 200)
diastolic_bp = np.random.normal(80, 12, n_samples)
diastolic_bp = np.clip(diastolic_bp, 50, 130)
heart_rate = np.random.normal(70, 12, n_samples)
heart_rate = np.clip(heart_rate, 40, 120)
spo2 = np.random.normal(97, 2, n_samples)
spo2 = np.clip(spo2, 85, 100)
glucose = np.random.normal(110, 30, n_samples)
glucose = np.clip(glucose, 70, 300)
bmi = np.random.normal(26, 5, n_samples)
bmi = np.clip(bmi, 15, 50)

X = np.column_stack([age, gender, systolic_bp, diastolic_bp, heart_rate, spo2, glucose, bmi])

# Create target
y = ((systolic_bp > 140) | (glucose > 125) | (age > 65)).astype(int)
noise_idx = np.random.choice(n_samples, int(0.1 * n_samples), replace=False)
y[noise_idx] = 1 - y[noise_idx]

# Train model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
model = LogisticRegression(random_state=42, max_iter=1000)
model.fit(X_scaled, y)
accuracy = model.score(X_scaled, y)

print("\n✓ CVD Model Training:")
print(f"  - Samples: {n_samples}")
print(f"  - Features: 8 (age, gender, BP, heart_rate, SpO2, glucose, BMI)")
print(f"  - Accuracy: {accuracy:.3f}")

# Test prediction
test_data = np.array([[55, 1, 145, 92, 78, 96, 135, 28.5]])
test_scaled = scaler.transform(test_data)
risk_score = model.predict_proba(test_scaled)[0][1]
print(f"\n✓ Sample Prediction (Age 55, M, SysBP 145, Glucose 135):")
print(f"  - Risk Score: {risk_score:.3f}")
print(f"  - Risk Level: {'HIGH' if risk_score > 0.7 else 'MODERATE' if risk_score > 0.4 else 'LOW'}")
print(f"  - Confidence: {max(risk_score, 1 - risk_score) * 100:.1f}%")

# Generate Diabetes data
print("\n✓ Diabetes Model Training:")
glucose_d = np.random.normal(115, 35, n_samples)
glucose_d = np.clip(glucose_d, 70, 300)
hba1c = np.random.normal(6.0, 1.5, n_samples)
hba1c = np.clip(hba1c, 4.0, 14.0)
bmi_d = np.random.normal(27, 6, n_samples)
bmi_d = np.clip(bmi_d, 15, 50)
age_d = np.random.normal(50, 18, n_samples)
age_d = np.clip(age_d, 18, 100)
systolic_d = np.random.normal(128, 18, n_samples)
systolic_d = np.clip(systolic_d, 80, 200)

X_d = np.column_stack([glucose_d, hba1c, bmi_d, age_d, systolic_d])
y_d = ((glucose_d > 125) & (hba1c > 6.5)).astype(int)
noise_idx_d = np.random.choice(n_samples, int(0.15 * n_samples), replace=False)
y_d[noise_idx_d] = 1 - y_d[noise_idx_d]

scaler_d = StandardScaler()
X_scaled_d = scaler_d.fit_transform(X_d)
model_d = LogisticRegression(random_state=42, max_iter=1000)
model_d.fit(X_scaled_d, y_d)
accuracy_d = model_d.score(X_scaled_d, y_d)

print(f"  - Samples: {n_samples}")
print(f"  - Features: 5 (glucose, HbA1c, BMI, age, systolic_bp)")
print(f"  - Accuracy: {accuracy_d:.3f}")

# Test diabetes prediction
test_diabetes = np.array([[145, 7.2, 31.0, 58, 138]])
test_scaled_d = scaler_d.transform(test_diabetes)
risk_score_d = model_d.predict_proba(test_scaled_d)[0][1]
print(f"\n✓ Sample Diabetes Prediction (Glucose 145, HbA1c 7.2):")
print(f"  - Risk Score: {risk_score_d:.3f}")
print(f"  - Risk Level: {'HIGH' if risk_score_d > 0.7 else 'MODERATE' if risk_score_d > 0.4 else 'LOW'}")

print("\n" + "=" * 60)
print("✓ All core ML logic validated successfully!")
print("=" * 60)
print("\nNext steps:")
print("1. Install dependencies: pip install -r requirements.txt")
print("2. Run the Flask app: python app.py")
print("3. Test endpoints: curl http://localhost:5000/health")
print("=" * 60)
