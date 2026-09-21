# MediSphere Cognitive Twin - Getting Started Guide

**Status**: ✅ All services running and connected  
**Last Updated**: September 21, 2026

---

## 🚀 Quick Start

### Access the System

**Frontend Dashboard**:
```
URL: http://localhost:4200
Login with:
  Username: admin
  Password: admin123
```

**Backend API**:
```
Base URL: http://localhost:8080/api/v1
Health Check: http://localhost:8080/api/v1/health/status
```

**Database**:
```
MongoDB: mongodb://localhost:27017/medisphere_cognitive_twin
```

---

## 📋 What's Available

### 10 Patients Ready to Monitor
```
1. Ava Thompson (PAT-1001)     - Hypertension
2. Noah Williams (PAT-1002)    - Diabetes
3. Mia Chen (PAT-1003)         - Cardiac Risk
4. Ethan Rodriguez (PAT-1004)  - Respiratory Issues
5. Olivia Martin (PAT-1005)    - Hypertension
6. Liam Anderson (PAT-1006)    - Diabetes
7. Sophia Patel (PAT-1007)     - Cardiac Risk
8. James Wilson (PAT-1008)     - Chronic Kidney Disease
9. Emma Johnson (PAT-1009)     - Obesity
10. Daniel Brown (PAT-1010)    - Asthma
```

### 12 Active Alerts for Testing
```
• 4 CRITICAL Alerts (AFib, Hypertension)
• 8 HIGH Alerts (Hypertension, Hypoxia)
• All with provider routing configured
• All with response time tracking
```

### 3 Federated Learning Models
```
• CVD (Cardiovascular Disease) Prediction
• Diabetes Risk Assessment
• Readmission Risk Prediction
```

---

## 🔐 Authentication

### Login as Admin
```
Username: admin
Password: admin123
Access: All patients, all features
```

### Login as Patient
```
Username: ava.thompson
Password: patient123
Patient ID: PAT-1001
Access: Own patient data only
```

### How It Works

```
1. Frontend Login Form
   Input: username + password
   ↓
2. Backend Authentication
   POST /api/auth/login
   Validates against MongoDB users
   ↓
3. Token Response
   Returns: token, userId, role, patientId
   ↓
4. Frontend Storage
   Stores in sessionStorage
   ↓
5. Subsequent Requests
   Adds auth headers (X-User-Role, X-User-Id)
   ↓
6. Backend Authorization
   Validates role and permissions
```

---

## 🏥 Frontend Features

### Dashboard
**URL**: http://localhost:4200/dashboard

Shows:
- ✅ 10 active patients in searchable table
- ✅ Patient demographics (name, age, gender)
- ✅ Medical conditions and status
- ✅ Quick access to patient details

```
Patient List Table:
┌─────────────┬──────────────┬─────────┬──────────────────┐
│ Patient ID  │ Name         │ Gender  │ Conditions       │
├─────────────┼──────────────┼─────────┼──────────────────┤
│ PAT-1001    │ Ava Thompson │ Female  │ Hypertension     │
│ PAT-1002    │ Noah William │ Male    │ Diabetes         │
│ PAT-1003    │ Mia Chen     │ Female  │ Cardiac Risk     │
└─────────────┴──────────────┴─────────┴──────────────────┘
```

### Patient 360 View
Click on any patient to see:
- ✅ Complete patient history
- ✅ Current vitals
- ✅ Medications and allergies
- ✅ Consents and preferences
- ✅ Recent alerts
- ✅ Health risk predictions

### Real-Time Alerts
**URL**: http://localhost:4200/monitoring

Shows:
- ✅ 12 active alerts
- ✅ Severity indicators (Critical 🔴, High 🟡)
- ✅ Patient name and vital readings
- ✅ AI confidence scores
- ✅ Suggested clinical actions
- ✅ Provider notifications status

---

## 🔧 Backend APIs

### Health & Status

**Check Backend Health**
```bash
curl http://localhost:8080/api/v1/health/status

Response:
{"status": "UP"}
```

---

### Patient Management

**Get All Active Patients**
```bash
curl http://localhost:8080/api/v1/patients/list/active

Response:
[
  {
    "id": "...",
    "patientId": "PAT-1001",
    "firstName": "Ava",
    "lastName": "Thompson",
    "dateOfBirth": "1975-03-15",
    "gender": "FEMALE",
    "conditions": ["Hypertension"],
    "status": "ACTIVE"
  },
  ... (9 more patients)
]
```

**Get Single Patient**
```bash
curl http://localhost:8080/api/v1/patients/PAT-1001

Response: Single patient document with full details
```

---

### Vitals Monitoring

**Get Patient Vitals**
```bash
curl http://localhost:8080/api/v1/vitals/patient/PAT-1001

Response:
{
  "heartRate": 72,
  "systolicBP": 128,
  "diastolicBP": 82,
  "oxygenSaturation": 97.5,
  "temperature": 36.8,
  "bloodGlucose": 110,
  "respiratoryRate": 16
}
```

**Get Latest Vitals**
```bash
curl http://localhost:8080/api/v1/vitals/patient/PAT-1001/latest

Response: Most recent vital reading
```

---

### Real-Time Monitoring

**Get Alert Dashboard**
```bash
curl http://localhost:8080/api/v1/monitoring/dashboard

Response:
{
  "totalPending": 12,
  "critical": 4,
  "high": 8,
  "recentAlerts": [
    {
      "patientId": "PAT-1001",
      "patientName": "Sarah M.",
      "alertType": "AFIB_DETECTED",
      "severity": "CRITICAL",
      "confidence": 0.89,
      "heartRate": 145,
      "status": "TRIGGERED"
    },
    ... (9 more alerts)
  ]
}
```

**Get Critical Alerts for Patient**
```bash
curl http://localhost:8080/api/v1/monitoring/patient/PAT-1001/critical

Response: Array of critical alerts for patient
```

**Get Alert Fatigue Metrics**
```bash
curl http://localhost:8080/api/v1/monitoring/patient/PAT-1001/fatigue-metrics

Response:
{
  "totalAlerts": 4,
  "falseAlerts": 0,
  "falseAlertRate": "0.0%",
  "alertsIn24h": 4,
  "withinThreshold": true
}
```

---

### Alert Management

**Acknowledge Alert** (Provider Response)
```bash
curl -X POST http://localhost:8080/api/v1/monitoring/{alertId}/acknowledge \
  -H "X-Provider-Id: cardiologist@medisphere.com"

Response:
{
  "message": "Alert acknowledged",
  "alert": {
    "status": "ACKNOWLEDGED",
    "acknowledgedAt": "2026-09-21T16:02:06",
    "responseTimeMs": 380119
  }
}
```

**Resolve Alert** (Documentation)
```bash
curl -X POST http://localhost:8080/api/v1/monitoring/{alertId}/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "resolution": "Patient confirmed on warfarin, ECG shows AFib pattern",
    "isFalseAlert": false
  }'

Response:
{
  "message": "Alert resolved",
  "alert": {
    "status": "RESOLVED",
    "resolution": "...",
    "resolvedAt": "2026-09-21T16:02:22"
  }
}
```

---

### Federated Learning

**Get Active Models**
```bash
curl http://localhost:8080/api/v1/federated-learning/active

Response:
[
  {
    "id": "FL-CVD-001",
    "name": "Cardiovascular Disease Model",
    "status": "ACTIVE",
    "accuracy": 0.92
  },
  {
    "id": "FL-DIABETES-001",
    "name": "Diabetes Risk Model",
    "status": "ACTIVE",
    "accuracy": 0.88
  },
  {
    "id": "FL-READMISSION-001",
    "name": "Readmission Risk Model",
    "status": "ACTIVE",
    "accuracy": 0.85
  }
]
```

---

## 💾 Database Collections

### Patients Collection
```mongodb
db.patients.find({status: "ACTIVE"})
Result: 10 documents
```

### Vitals Collection
```mongodb
db.vitals.find({patientId: "PAT-1001"})
Result: Vital records for patient
```

### Clinical Alerts Collection
```mongodb
db.clinical_alerts.find({status: "TRIGGERED"})
Result: 12 active alerts
```

### Users Collection
```mongodb
db.users.find()
Result: 12 user documents (1 admin + 10 patients + 1 provider)
```

---

## 🧪 Testing Workflows

### Workflow 1: View Patient Data

```
1. Open Frontend
   http://localhost:4200/login

2. Login as Admin
   Username: admin
   Password: admin123

3. View Dashboard
   See 10 patients in table

4. Click Patient Row
   View patient details

5. Check Vitals
   See current vital signs

6. Verify Data
   ✅ All data from MongoDB
```

---

### Workflow 2: Monitor Alerts

```
1. Navigate to Alerts
   http://localhost:4200/monitoring

2. View Active Alerts
   See 12 pending alerts
   Severity: Critical (4), High (8)

3. Click Alert
   View full alert details:
   - Patient name
   - Vital readings
   - AI confidence
   - Suggested actions
   - Provider routing

4. Acknowledge Alert
   POST /api/v1/monitoring/{alertId}/acknowledge
   Response: Response time tracked

5. Resolve Alert
   POST /api/v1/monitoring/{alertId}/resolve
   Response: Resolution logged
```

---

### Workflow 3: Test Authentication

```
1. Try Admin Login
   Username: admin
   Password: admin123
   Result: ✅ Access all patients

2. Logout

3. Try Patient Login
   Username: ava.thompson
   Password: patient123
   Result: ✅ Access only own data

4. Logout

5. Try Invalid Credentials
   Username: invalid
   Password: wrong
   Result: ✅ Error message shown
```

---

### Workflow 4: Test Real-Time Features

```
1. Get Alert Dashboard
   GET /api/v1/monitoring/dashboard
   Result: 12 alerts returned

2. Get Critical Alerts
   GET /api/v1/monitoring/patient/PAT-1001/critical
   Result: 4 critical alerts returned

3. Acknowledge One Alert
   POST /api/v1/monitoring/{alertId}/acknowledge
   Result: Status changed to ACKNOWLEDGED

4. Check Fatigue Metrics
   GET /api/v1/monitoring/patient/PAT-1001/fatigue-metrics
   Result: False alert rate = 0.0% (within <3% target)
```

---

## 📊 Data Models

### Patient Object
```json
{
  "id": "mongodb_id",
  "patientId": "PAT-1001",
  "firstName": "Ava",
  "lastName": "Thompson",
  "dateOfBirth": "1975-03-15",
  "gender": "FEMALE",
  "email": "ava.thompson@example.com",
  "contact": "555-0001",
  "conditions": ["Hypertension"],
  "medications": ["Lisinopril"],
  "allergies": ["Aspirin"],
  "status": "ACTIVE",
  "consentProvided": true,
  "hipaaAcknowledged": true
}
```

### Alert Object
```json
{
  "id": "alert_id",
  "patientId": "PAT-1001",
  "patientName": "Sarah M.",
  "alertType": "AFIB_DETECTED",
  "severity": "CRITICAL",
  "triggeredAt": "2026-09-21T15:55:46",
  "diagnosis": "Possible Atrial Fibrillation",
  "confidence": 0.89,
  "heartRate": 145,
  "heartRhythm": "IRREGULAR",
  "systolicBP": 138,
  "diastolicBP": 85,
  "oxygenSaturation": 97.5,
  "suggestedActions": [
    "Perform 12-lead ECG immediately",
    "Check troponin levels"
  ],
  "notifiedProviders": [
    "cardiologist@medisphere.com",
    "emergency@medisphere.com"
  ],
  "status": "TRIGGERED"
}
```

### Vital Object
```json
{
  "id": "vital_id",
  "patientId": "PAT-1001",
  "heartRate": 72,
  "systolicBP": 128,
  "diastolicBP": 82,
  "oxygenSaturation": 97.5,
  "temperature": 36.8,
  "bloodGlucose": 110,
  "respiratoryRate": 16,
  "timestamp": "2026-09-21T15:59:46"
}
```

---

## 🔍 Debugging

### Check Frontend Console
```javascript
// Open browser DevTools (F12)
// Check Console tab for errors
// Check Network tab for API calls

// Verify auth user stored
JSON.parse(sessionStorage.getItem('medisphere_auth_user'))

// Should show:
{
  "userId": "...",
  "username": "admin",
  "role": "ADMIN",
  "token": "..."
}
```

### Check Backend Logs
```
Spring Boot console shows:
- Login attempts
- API calls
- Database queries
- Errors and warnings

Look for:
✅ "Starting MediSphereApplication"
✅ "Tomcat initialized with port 8080"
✅ "User logged in successfully"
✅ "Patients loaded from MongoDB"
```

### Check Database Connection
```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/medisphere_cognitive_twin

# List collections
show collections

# Check patient count
db.patients.count()

# Check alerts
db.clinical_alerts.find({status: "TRIGGERED"}).count()
```

---

## 🚀 Common Tasks

### Task 1: Add New Patient
```
Backend: POST /api/v1/patients
Frontend: Not yet implemented (coming soon)
Manual: Insert document into MongoDB
```

### Task 2: Create Consent Record
```
Backend: POST /api/v1/consents
Frontend: Consent form (coming soon)
Manual: Insert consent document
```

### Task 3: Trigger Manual Alert
```
Backend: POST /api/v1/monitoring/create-alert
Note: Requires JSON alert object
```

### Task 4: Update Patient Vitals
```
Backend: POST /api/v1/vitals
Body: Vitals object with patientId
Result: New vital record created
```

---

## 💡 Tips & Best Practices

### API Calls
- Always include proper headers (X-User-Role, X-User-Id)
- Use JSON content type for POST/PUT requests
- Handle 401/403 responses for auth failures
- Log all API calls for debugging

### Database Queries
- Always filter by status when appropriate
- Use indexes for performance (patientId, timestamp)
- Validate data before insertion
- Archive old records regularly

### Frontend
- Check sessionStorage for auth user
- Handle loading states
- Show error messages to users
- Refresh data on tab focus

### Security
- Never expose passwords in logs
- Always validate user role before API calls
- Use HTTPS in production
- Rotate tokens regularly

---

## 📞 Troubleshooting

### Issue: Frontend shows "Cannot connect to backend"
**Solution**:
1. Check if backend is running: `netstat -ano | findstr ":8080"`
2. Check backend logs for startup errors
3. Verify MongoDB is connected
4. Try health check: `http://localhost:8080/api/v1/health/status`

### Issue: Patients not showing in dashboard
**Solution**:
1. Verify login credentials
2. Check if user role is ADMIN
3. Check MongoDB: `db.patients.find().count()`
4. Check browser console for API errors

### Issue: Alerts not generating
**Solution**:
1. Check if backend is running
2. Verify MongoDB connection
3. Check real-time monitoring logs
4. Test endpoint: `/api/v1/monitoring/dashboard`

### Issue: Authentication failing
**Solution**:
1. Clear sessionStorage in browser
2. Try different credentials
3. Check backend user records in MongoDB
4. Verify BCrypt password hashing

---

## 📚 Additional Resources

### Documentation Files
- `REALTIME_MONITORING_QUICK_START.md` - Alert API guide
- `CONNECTION_VERIFICATION_LIVE.md` - System connection status
- `SYSTEM_DASHBOARD.md` - Overall system health
- `FRONTEND_BACKEND_CONNECTION_FIXED.md` - Architecture details

### Code Files
- `backend/src/main/java/com/medisphere/controller/` - API controllers
- `backend/src/main/java/com/medisphere/service/` - Business logic
- `frontend/src/app/services/` - Angular services
- `frontend/src/app/pages/` - Frontend pages

---

## 🎉 You're Ready!

Your MediSphere Cognitive Twin system is fully operational and ready to use:

✅ Frontend accessible at localhost:4200  
✅ Backend API at localhost:8080  
✅ MongoDB database connected  
✅ 10 patients ready for monitoring  
✅ 12 active alerts for testing  
✅ Real-time features enabled  
✅ All data persisted  

**Start exploring by visiting**: http://localhost:4200/login

---

**Status**: 🟢 System Ready  
**Last Updated**: September 21, 2026  
**Support**: Check documentation files for details

