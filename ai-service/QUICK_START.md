# MediSphere AI Service - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies
```bash
cd d:\MediSphere_Cognitive\ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Run the Service
```bash
python app.py
```

You'll see:
```
Starting MediSphere AI Service...
Health Check: http://localhost:5000/health
API Docs: http://localhost:5000/
```

### Step 3: Test an Endpoint
```bash
# In another terminal, test health check
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "MediSphere AI Service",
  "timestamp": "2024-01-15T10:30:45.123456"
}
```

## 🔍 Common API Calls

### Get Model Information
```bash
curl http://localhost:5000/model/info
```

### Predict CVD Risk
```bash
curl -X POST http://localhost:5000/predict/cvd \
  -H "Content-Type: application/json" \
  -d '{
    "age": 55,
    "gender": "M",
    "systolic_bp": 145,
    "diastolic_bp": 92,
    "heart_rate": 78,
    "spo2": 96,
    "glucose": 135,
    "bmi": 28.5
  }'
```

Returns: Risk score (0-1), risk level (LOW/MODERATE/HIGH), and SHAP explanations

### Predict Diabetes Risk
```bash
curl -X POST http://localhost:5000/predict/diabetes \
  -H "Content-Type: application/json" \
  -d '{
    "glucose": 145,
    "hba1c": 7.2,
    "bmi": 31.0,
    "age": 58,
    "systolic_bp": 138
  }'
```

### Run Federated Training
```bash
# Initialize
curl -X POST http://localhost:5000/federated/initialize \
  -H "Content-Type: application/json" \
  -d '{"num_rounds": 3, "model_type": "CVD"}'

# Run round 1 with 5 participants
curl -X POST http://localhost:5000/federated/train-round/CVD \
  -H "Content-Type: application/json" \
  -d '{"round_number": 1, "participants": 5}'

# Check status
curl http://localhost:5000/federated/status
```

## 📊 What You Get

### Each Prediction Returns:
- **risk_score** (0-1): Probability of disease
- **risk_level**: LOW, MODERATE, or HIGH
- **confidence**: Model confidence percentage
- **shap_explanation**: Which features drive the prediction
- **timestamp**: When prediction was made

Example CVD output:
```json
{
  "risk_score": 0.724,
  "risk_level": "HIGH",
  "confidence": 72.4,
  "shap_explanation": {
    "systolic_bp": 0.35,
    "glucose": 0.28,
    "bmi": 0.18,
    "diastolic_bp": 0.12,
    "age": 0.15
  }
}
```

## 🧪 Validate Setup

Run the test script to verify everything works:
```bash
python test_ml_logic.py
```

Expected output:
```
✓ CVD Model Training: 76.2% accuracy
✓ Diabetes Model Training: 79.0% accuracy
✓ All core ML logic validated successfully!
```

## 📝 Model Details

| Model | Features | Accuracy | Input Examples |
|-------|----------|----------|-----------------|
| CVD | age, gender, systolic_bp, diastolic_bp, heart_rate, spo2, glucose, bmi | 76% | Age 55, SysBP 145, Glucose 135 |
| Diabetes | glucose, hba1c, bmi, age, systolic_bp | 79% | Glucose 145, HbA1c 7.2, BMI 31 |

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: flask` | Run `pip install -r requirements.txt` |
| `Port 5000 already in use` | Edit app.py and change port to 8000 |
| `Connection refused` | Make sure Flask app is running (python app.py) |
| Low accuracy | Run federated training rounds to improve |

## 📚 Documentation

- **README.md** - Full API documentation with all endpoints
- **IMPLEMENTATION_SUMMARY.md** - Detailed implementation details
- **app.py** - Source code with inline comments

## 🚀 Next Steps

1. ✅ Install and run the service
2. ✅ Test prediction endpoints
3. ✅ Integrate with Spring Boot backend
4. ✅ Monitor in production

## 📞 Support

For issues:
1. Check README.md for detailed API documentation
2. Review IMPLEMENTATION_SUMMARY.md for architecture details
3. Run test_ml_logic.py to validate ML functionality
4. Check app.py source code for implementation details

---

**Ready to predict patient risk!** 🏥
