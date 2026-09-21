"""
MediSphere AI Service - Flask Server
Provides CVD and Diabetes risk prediction with SHAP explanations and federated learning
"""

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification
import shap
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# ============================================================================
# GLOBAL STATE AND MODELS
# ============================================================================

class MLModel:
    """Wrapper for ML models with training and prediction"""
    def __init__(self, model_name, features):
        self.model_name = model_name
        self.features = features
        self.model = LogisticRegression(random_state=42, max_iter=1000)
        self.scaler = StandardScaler()
        self.explainer = None
        self.accuracy = 0.0
        self.training_rounds = 0
        self.version = "1.0.0"
        
    def train(self, X, y):
        """Train the model on given data"""
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        accuracy = self.model.score(X_scaled, y)
        self.accuracy = float(accuracy)
        self.explainer = shap.LinearExplainer(self.model, X_scaled)
        return self.accuracy
    
    def predict(self, X):
        """Predict risk scores (probabilities)"""
        if isinstance(X, list):
            X = np.array(X).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        probabilities = self.model.predict_proba(X_scaled)
        return probabilities[:, 1]  # Return risk probability
    
    def explain(self, X):
        """Generate SHAP explanations"""
        if isinstance(X, list):
            X = np.array(X).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        shap_values = self.explainer.shap_values(X_scaled)
        if isinstance(shap_values, list):
            shap_values = shap_values[1]  # For binary classification, get positive class
        return shap_values[0] if len(shap_values.shape) > 1 else shap_values


# ============================================================================
# SYNTHETIC DATA GENERATION
# ============================================================================

def generate_cvd_data(n_samples=500):
    """Generate realistic synthetic CVD training data"""
    np.random.seed(42)
    
    # CVD features: age, gender, systolic_bp, diastolic_bp, heart_rate, spo2, glucose, bmi
    age = np.random.normal(55, 15, n_samples)  # Mean 55, std 15
    age = np.clip(age, 18, 100)
    
    gender = np.random.choice([0, 1], n_samples)  # 0=F, 1=M
    
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
    
    # Target: CVD risk (high BP, high glucose, older age correlate with higher risk)
    y = ((systolic_bp > 140) | (glucose > 125) | (age > 65)).astype(int)
    # Add some noise
    noise_idx = np.random.choice(n_samples, int(0.1 * n_samples), replace=False)
    y[noise_idx] = 1 - y[noise_idx]
    
    return X, y


def generate_diabetes_data(n_samples=500):
    """Generate realistic synthetic Diabetes training data"""
    np.random.seed(42)
    
    # Diabetes features: glucose, hba1c, bmi, age, systolic_bp
    glucose = np.random.normal(115, 35, n_samples)
    glucose = np.clip(glucose, 70, 300)
    
    hba1c = np.random.normal(6.0, 1.5, n_samples)
    hba1c = np.clip(hba1c, 4.0, 14.0)
    
    bmi = np.random.normal(27, 6, n_samples)
    bmi = np.clip(bmi, 15, 50)
    
    age = np.random.normal(50, 18, n_samples)
    age = np.clip(age, 18, 100)
    
    systolic_bp = np.random.normal(128, 18, n_samples)
    systolic_bp = np.clip(systolic_bp, 80, 200)
    
    X = np.column_stack([glucose, hba1c, bmi, age, systolic_bp])
    
    # Target: Diabetes risk (high glucose and hba1c indicate higher risk)
    y = ((glucose > 125) & (hba1c > 6.5)).astype(int)
    # Add some noise
    noise_idx = np.random.choice(n_samples, int(0.15 * n_samples), replace=False)
    y[noise_idx] = 1 - y[noise_idx]
    
    return X, y


# ============================================================================
# INITIALIZE MODELS
# ============================================================================

# CVD Model
cvd_features = ["age", "gender", "systolic_bp", "diastolic_bp", "heart_rate", "spo2", "glucose", "bmi"]
cvd_model = MLModel("CVD", cvd_features)
X_cvd, y_cvd = generate_cvd_data(500)
cvd_model.train(X_cvd, y_cvd)

# Diabetes Model
diabetes_features = ["glucose", "hba1c", "bmi", "age", "systolic_bp"]
diabetes_model = MLModel("Diabetes", diabetes_features)
X_diabetes, y_diabetes = generate_diabetes_data(500)
diabetes_model.train(X_diabetes, y_diabetes)

# Federated Learning State
federated_state = {
    "rounds_completed": 0,
    "models": {},
    "round_history": []
}


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "MediSphere AI Service",
        "timestamp": datetime.now().isoformat()
    }), 200


@app.route('/predict/cvd', methods=['POST'])
def predict_cvd():
    """
    POST /predict/cvd
    
    Predicts cardiovascular disease risk with SHAP explanations.
    
    Request body:
    {
        "age": 45,
        "gender": "M",
        "systolic_bp": 130,
        "diastolic_bp": 85,
        "heart_rate": 72,
        "spo2": 98,
        "glucose": 110,
        "bmi": 25.5
    }
    """
    try:
        data = request.get_json()
        
        # Extract features in order
        gender_value = 1 if data.get("gender", "M").upper() == "M" else 0
        features = [
            data.get("age", 50),
            gender_value,
            data.get("systolic_bp", 120),
            data.get("diastolic_bp", 80),
            data.get("heart_rate", 70),
            data.get("spo2", 97),
            data.get("glucose", 110),
            data.get("bmi", 25)
        ]
        
        # Get prediction
        risk_score = float(cvd_model.predict(features)[0])
        risk_level = "HIGH" if risk_score > 0.7 else "MODERATE" if risk_score > 0.4 else "LOW"
        
        # Get SHAP explanation
        shap_vals = cvd_model.explain(features)
        explanation = {
            feature: float(val) for feature, val in zip(cvd_features, shap_vals)
        }
        
        return jsonify({
            "model": "CVD Risk Prediction",
            "patient_data": data,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": round(max(risk_score, 1 - risk_score) * 100, 2),
            "shap_explanation": explanation,
            "shap_base_value": float(cvd_model.explainer.expected_value),
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    """
    POST /predict/diabetes
    
    Predicts diabetes risk with SHAP explanations.
    
    Request body:
    {
        "glucose": 125,
        "hba1c": 6.5,
        "bmi": 28,
        "age": 50,
        "systolic_bp": 130
    }
    """
    try:
        data = request.get_json()
        
        # Extract features in order
        features = [
            data.get("glucose", 110),
            data.get("hba1c", 6.0),
            data.get("bmi", 25),
            data.get("age", 50),
            data.get("systolic_bp", 120)
        ]
        
        # Get prediction
        risk_score = float(diabetes_model.predict(features)[0])
        risk_level = "HIGH" if risk_score > 0.7 else "MODERATE" if risk_score > 0.4 else "LOW"
        
        # Get SHAP explanation
        shap_vals = diabetes_model.explain(features)
        explanation = {
            feature: float(val) for feature, val in zip(diabetes_features, shap_vals)
        }
        
        return jsonify({
            "model": "Diabetes Risk Prediction",
            "patient_data": data,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": round(max(risk_score, 1 - risk_score) * 100, 2),
            "shap_explanation": explanation,
            "shap_base_value": float(diabetes_model.explainer.expected_value),
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/model/info', methods=['GET'])
def model_info():
    """
    GET /model/info
    
    Returns model accuracy and version information
    """
    return jsonify({
        "models": [
            {
                "name": "CVD Risk Prediction",
                "version": cvd_model.version,
                "accuracy": cvd_model.accuracy,
                "features": cvd_model.features,
                "training_rounds": cvd_model.training_rounds
            },
            {
                "name": "Diabetes Risk Prediction",
                "version": diabetes_model.version,
                "accuracy": diabetes_model.accuracy,
                "features": diabetes_model.features,
                "training_rounds": diabetes_model.training_rounds
            }
        ],
        "timestamp": datetime.now().isoformat()
    }), 200


@app.route('/federated/initialize', methods=['POST'])
def federated_initialize():
    """
    POST /federated/initialize
    
    Setup federated learning rounds.
    
    Request body:
    {
        "num_rounds": 5,
        "model_type": "CVD"
    }
    """
    try:
        data = request.get_json()
        num_rounds = data.get("num_rounds", 5)
        model_type = data.get("model_type", "CVD")
        
        federated_state["rounds_completed"] = 0
        federated_state["models"] = {
            "round_0": {
                "model_type": model_type,
                "timestamp": datetime.now().isoformat()
            }
        }
        
        return jsonify({
            "status": "initialized",
            "num_rounds": num_rounds,
            "model_type": model_type,
            "rounds_completed": federated_state["rounds_completed"],
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/federated/train-round/<model_type>', methods=['POST'])
def federated_train_round(model_type):
    """
    POST /federated/train-round/{model_type}
    
    Run federated training round simulation.
    
    Request body:
    {
        "round_number": 1,
        "participants": 3
    }
    """
    try:
        data = request.get_json()
        round_number = data.get("round_number", federated_state["rounds_completed"] + 1)
        num_participants = data.get("participants", 1)
        
        # Select the appropriate model
        if model_type.upper() == "CVD":
            model = cvd_model
            X, y = generate_cvd_data(100)
        elif model_type.upper() == "DIABETES":
            model = diabetes_model
            X, y = generate_diabetes_data(100)
        else:
            return jsonify({"error": f"Unknown model type: {model_type}"}), 400
        
        # Simulate federated training: aggregate updates from participants
        aggregated_accuracy = 0.0
        participant_accuracies = []
        
        for i in range(num_participants):
            # Each participant trains on their local data
            local_accuracy = model.train(X, y)
            participant_accuracies.append(local_accuracy)
            aggregated_accuracy += local_accuracy
        
        aggregated_accuracy /= num_participants
        model.training_rounds += 1
        model.accuracy = aggregated_accuracy
        
        round_info = {
            "round_number": round_number,
            "model_type": model_type,
            "participants": num_participants,
            "aggregated_accuracy": aggregated_accuracy,
            "participant_accuracies": participant_accuracies,
            "timestamp": datetime.now().isoformat()
        }
        
        federated_state["rounds_completed"] += 1
        federated_state["round_history"].append(round_info)
        federated_state["models"][f"round_{round_number}"] = round_info
        
        return jsonify({
            "status": "completed",
            "round_number": round_number,
            "model_type": model_type,
            "num_participants": num_participants,
            "aggregated_accuracy": aggregated_accuracy,
            "participant_accuracies": participant_accuracies,
            "total_rounds_completed": federated_state["rounds_completed"],
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/federated/status', methods=['GET'])
def federated_status():
    """
    GET /federated/status
    
    Get federated learning status
    """
    return jsonify({
        "rounds_completed": federated_state["rounds_completed"],
        "round_history": federated_state["round_history"],
        "timestamp": datetime.now().isoformat()
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Root endpoint with service information"""
    return jsonify({
        "service": "MediSphere AI Service",
        "version": "2.0.0",
        "description": "Machine Learning service for CVD and Diabetes risk prediction",
        "endpoints": {
            "health": "GET /health",
            "cvd_prediction": "POST /predict/cvd",
            "diabetes_prediction": "POST /predict/diabetes",
            "model_info": "GET /model/info",
            "federated_initialize": "POST /federated/initialize",
            "federated_train_round": "POST /federated/train-round/<model_type>",
            "federated_status": "GET /federated/status"
        }
    }), 200


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    print("Starting MediSphere AI Service...")
    print("Health Check: http://localhost:5000/health")
    print("API Docs: http://localhost:5000/")
    app.run(debug=True, host='0.0.0.0', port=5000)
