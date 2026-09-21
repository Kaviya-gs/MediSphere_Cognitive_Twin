# MediSphere Frontend - Angular Application

## Overview

Modern Angular application for real-time patient monitoring, vitals tracking, and clinical decision support.

**Framework**: Angular 20.3.30  
**Language**: TypeScript  
**Port**: 4200

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI

### Installation

```bash
cd frontend
npm install
npm start
```

Visit: `http://localhost:4200/login`

---

## Features

- **Patient Dashboard** - View 10 active patients with real data
- **Vitals Monitoring** - Real-time vital signs from wearables
- **Lab Results** - Clinical laboratory test results
- **Real-Time Alerts** - AI-powered clinical alerts with 70-89% confidence
- **Health Twin** - Patient 360-degree health profile
- **Risk Predictions** - ML-based cardiovascular and diabetes risk scores
- **HIPAA Compliant** - Secure patient data handling

---

## Project Structure

```
frontend/src/app/
├── pages/
│   ├── login/                  # Authentication
│   ├── dashboard/              # Patient list & overview
│   ├── patients/               # Patient details
│   ├── vitals/                 # Vital signs monitoring
│   ├── clinical-page/          # Labs, alerts, models
│   └── health-twin/            # Patient 360 view
├── services/
│   ├── api.config.ts           # Centralized API configuration
│   ├── auth.service.ts         # Authentication & JWT
│   ├── patient.service.ts      # Patient data access
│   ├── vitals.service.ts       # Vitals data
│   ├── clinical-data.service.ts # Labs, alerts, models
│   └── auth.interceptor.ts     # Request/response interceptor
├── guards/
│   └── auth.guard.ts           # Route protection
└── components/
    └── [shared components]
```

---

## Authentication

### Login Flow

```typescript
// credentials
Username: admin
Password: admin123

// Response includes:
{
  "token": "jwt-token",
  "userId": "user-id",
  "role": "ADMIN",
  "patientId": null
}
```

### Roles

- **ADMIN** - Access all patients
- **PATIENT** - Access own patient data only
- **PROVIDER** - Access assigned patients

### Headers

All requests include:
```
X-User-Role: ADMIN|PATIENT|PROVIDER
X-User-Id: <user-id>
X-User-Patient-Id: <patient-id>
```

---

## API Configuration

File: `src/app/services/api.config.ts`

```typescript
API_CONFIG = {
  baseUrl: 'http://localhost:8080',
  authUrl: 'http://localhost:8080/api',
  endpoints: {
    auth: '/auth/login',
    patients: '/v1/patients/list/active',
    vitals: '/v1/vitals',
    labs: '/v1/labs',
    alerts: '/v1/monitoring',
    models: '/v1/federated-learning/active'
  }
}
```

---

## Services

### PatientService

```typescript
// Get all active patients
getAllActivePatients(): Observable<Patient[]>

// Get single patient
getPatient(id: string): Observable<Patient>

// Create patient
createPatient(patient: Patient): Observable<Patient>
```

### VitalsService

```typescript
// Get latest vitals
getLatestVitals(patientId: string): Observable<Vitals[]>

// Record new vitals
recordVitals(vitals: Vitals): Observable<Vitals>
```

### ClinicalDataService

```typescript
// Get lab results
getLabs(): Observable<LabResult[]>
getLabsByPatient(patientId: string): Observable<LabResult[]>

// Get alerts
getAlerts(): Observable<Alert[]>
getAlertsForPatient(patientId: string): Observable<Alert[]>

// Get models
getModels(): Observable<Model[]>
```

---

## Real Data

### Connected to MongoDB

- **10 Patients** - Real patient profiles
- **32+ Vitals** - Wearable device readings
- **20+ Lab Results** - Clinical test results
- **12 Alerts** - Real-time AI alerts
- **3 Models** - Federated learning models

All data flows from backend APIs.

---

## Build & Deploy

### Development Build

```bash
npm start
```

### Production Build

```bash
npm run build
# Output: dist/

# Deploy dist/ to web server
```

### Docker

```dockerfile
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## Environment Configuration

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_PATH=/api
```

---

## Troubleshooting

### Can't connect to backend

- Check backend is running on port 8080
- Verify CORS configuration
- Check browser console for errors

### Login fails

- Verify credentials (admin / admin123)
- Check NetworkTab for API response
- Verify backend database connection

### No data showing

- Check patient list loads
- Verify MongoDB connection
- Check backend logs for errors
- Ensure user role has access

---

## Security

- ✅ JWT authentication
- ✅ CORS configured for localhost:8080
- ✅ Session storage for tokens
- ✅ Auth interceptor on all requests
- ✅ Route guards for protected pages
- ✅ No credentials in code

---

## Support

See documentation:
- `GETTING_STARTED.md` - Complete setup guide
- `API_REFERENCE.md` - All endpoints
- `SECURITY.md` - Security details

