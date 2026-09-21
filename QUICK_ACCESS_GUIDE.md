# MediSphere Cognitive Twin - Quick Access Guide

**Status:** ✅ FULLY CONNECTED AND RUNNING

---

## 🚀 Access the Application

### Frontend Dashboard
**Open in Browser:** 
- `http://localhost:52204` 
- (or the port shown in terminal)

You'll see the MediSphere dashboard with 10 real patient records from MongoDB.

---

## 📊 Available Features

### Dashboard Overview
- **Total Patients:** 10 (from MongoDB)
- **Active Health Twins:** 10
- **FHIR Resources:** Synced
- **Active Alerts:** Status monitoring

### Patient Management
1. Click **"Recent patients"** table to see all 10 patients:
   - Ava Thompson (Hypertension)
   - Noah Williams (Type 2 Diabetes)
   - Mia Chen (Asthma)
   - Ethan Rodriguez (Hyperlipidemia)
   - Olivia Martin (Prediabetes)
   - Liam Anderson (Hypertension)
   - Sophia Patel (Asthma)
   - James Wilson (Type 2 Diabetes)
   - Emma Johnson (Hyperlipidemia)
   - Daniel Brown (Hypertension + Diabetes)

2. Click **"View Patient"** on any row to see Patient 360:
   - Full patient demographics
   - Active conditions & medications
   - Allergies & consent status
   - HIPAA acknowledgment
   - Digital health twin status

3. Each patient has:
   - ✅ Vitals data (heart rate, BP, temperature, O2, glucose, etc.)
   - ✅ Medical conditions
   - ✅ Active medications
   - ✅ Known allergies
   - ✅ Consent records (FULL + AI_PREDICTION)
   - ✅ HIPAA acknowledgment

---

## 🔌 Backend API

**Backend Running At:** `http://localhost:8080`

**API Base URL:** `http://localhost:8080/api/v1`

### Health Check
```bash
curl http://localhost:8080/api/v1/health/status
```

### Patient List (REST API)
```bash
curl http://localhost:8080/api/v1/patients/list/active
```

---

## 🗄️ Database

**MongoDB Connected:** ✅ RUNNING

**Patient Records:** 10 active records  
**Vitals Records:** 10 records  
**Consent Records:** 20 records  

---

## 📝 Services Available

From the dashboard, you can access:

- **Patients** - Patient management & details
- **Vitals** - Vital signs monitoring
- **Health Twin** - Digital health twin
- **Risk Predictions** - CVD, Diabetes, Readmission
- **Alerts** - Risk alerts & notifications
- **Models** - ML model management
- **Federated Learning** - Distributed model training
- **FHIR Resources** - Health data standards
- **Consent** - Patient consent management
- **Audit** - HIPAA compliance logs

---

## 🔄 Real-Time Updates

The application has:
- ✅ **Hot Reload** - Changes in code auto-refresh browser
- ✅ **Live API Calls** - Real data from MongoDB
- ✅ **Error Handling** - Graceful error messages
- ✅ **Retry Logic** - Automatic retry on failure

---

## 🧪 Testing Tips

### Test 1: View Patient Data
1. Open dashboard
2. See patient count = 10
3. Click "View Patient" on any row
4. See full patient details

### Test 2: Check API Calls
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform any action
4. See requests to `http://localhost:8080/api/v1/*`
5. All should return HTTP 200

### Test 3: Monitor Backend
1. Watch Spring Boot logs
2. See API requests logged
3. Verify database queries execute
4. Check Kafka messages

### Test 4: Patient Details
1. For each patient, verify:
   - ✅ Patient ID displayed
   - ✅ Name shown
   - ✅ Conditions listed
   - ✅ Medications displayed
   - ✅ Allergies noted
   - ✅ Consent status visible
   - ✅ HIPAA status confirmed

---

## 📋 Patient Data Summary

| ID | Name | Condition | Medications | Allergies |
|---|---|---|---|---|
| PAT-1001 | Ava Thompson | Hypertension | Lisinopril 10mg | Penicillin |
| PAT-1002 | Noah Williams | Type 2 Diabetes | Metformin 500mg | None |
| PAT-1003 | Mia Chen | Asthma | Albuterol inhaler | Latex |
| PAT-1004 | Ethan Rodriguez | Hyperlipidemia | Atorvastatin 20mg | None |
| PAT-1005 | Olivia Martin | Prediabetes | Lifestyle mgmt | None |
| PAT-1006 | Liam Anderson | Hypertension | Amlodipine 5mg | None |
| PAT-1007 | Sophia Patel | Asthma | Budesonide inhaler | Pollen |
| PAT-1008 | James Wilson | Type 2 Diabetes | Metformin 1000mg | None |
| PAT-1009 | Emma Johnson | Hyperlipidemia | Atorvastatin 10mg | Penicillin |
| PAT-1010 | Daniel Brown | HTN + Diabetes | Metformin/Losartan | None |

---

## 🛠️ Troubleshooting

### Issue: Page won't load
**Solution:** 
- Refresh browser (Ctrl+R)
- Check console for errors (F12)
- Verify backend is running

### Issue: "Unable to connect to backend"
**Solution:**
- Backend running at `http://localhost:8080`?
- API returning data?
- Test: `curl http://localhost:8080/api/v1/health/status`

### Issue: No patients showing
**Solution:**
- Check MongoDB is connected
- Verify 10 patients exist in DB
- Check backend logs for errors

### Issue: Port 52204 not accessible
**Solution:**
- Check terminal for actual port
- Likely 4200 was in use
- Use port shown in terminal output

---

## 📞 Support

**Backend Health:** `http://localhost:8080/api/v1/health/status`  
**Frontend:** `http://localhost:52204`  
**Database:** MongoDB (local)  
**Kafka:** Connected  
**FHIR:** R4 Integration ready  

---

## ✅ What's Running

- ✅ Spring Boot Backend (port 8080)
- ✅ Angular Frontend (port 52204)
- ✅ MongoDB Database (10 patients)
- ✅ Kafka Message Queue
- ✅ FHIR API Integration
- ✅ HIPAA Audit Logging

---

## 🎯 Next Steps

1. **Access Dashboard** → `http://localhost:52204`
2. **View Patients** → See all 10 in table
3. **Select Patient** → Click "View Patient"
4. **See Details** → Full patient 360 view
5. **Test APIs** → Open DevTools Network tab
6. **Monitor Backend** → Check Spring Boot logs

---

**Status:** 🟢 FULLY OPERATIONAL  
**Patients:** 10 active records  
**Data:** Real-time from MongoDB  
**Last Updated:** September 11, 2026
