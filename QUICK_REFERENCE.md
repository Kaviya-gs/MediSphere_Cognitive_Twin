# MediSphere Connection Quick Reference

## 🎯 Endpoint URLs (FINAL)

### Authentication
- **Login**: `POST http://localhost:8080/api/auth/login`
  - Request body: `{ username: "admin", password: "admin123" }`
  - Response: `{ token, userId, username, role, patientId }`

### Patient Data
- **Get All Active Patients**: `GET http://localhost:8080/api/v1/patients/list/active`
  - Requires header: `X-User-Role: ADMIN`
  - Response: `[ Patient1, Patient2, ..., Patient10 ]`
- **Get Single Patient**: `GET http://localhost:8080/api/v1/patients/{id}`
  - Requires header: `X-User-Role: ADMIN` or `X-User-Patient-Id: {id}`

### Health Check
- **Status**: `GET http://localhost:8080/api/v1/health/status`
  - No auth required

---

## 📋 Required Headers

Add these headers to ALL requests to `/api/v1/**` endpoints:

```
X-User-Role: ADMIN          (from AuthService.getCurrentUser().role)
X-User-Id: <user_id>        (from AuthService.getCurrentUser().userId)
X-User-Patient-Id: <id>     (from AuthService.getCurrentUser().patientId, or empty string)
```

**Added automatically by**: `AuthInterceptor`
**Source**: `sessionStorage.getItem('medisphere_auth_user')`

---

## 🔑 Request/Response Examples

### 1. Login Request
```
POST /api/auth/login

HEADERS:
  Content-Type: application/json

BODY:
{
  "username": "admin",
  "password": "admin123"
}

RESPONSE (200):
{
  "token": "64eab8a0-123e:admin:ADMIN:1694592000000:abc123",
  "userId": "64eab8a0-123e-45f2-8000-000000000001",
  "username": "admin",
  "role": "ADMIN",
  "patientId": null
}
```

### 2. Get Patients Request
```
GET /api/v1/patients/list/active

HEADERS:
  X-User-Role: ADMIN
  X-User-Id: 64eab8a0-123e-45f2-8000-000000000001
  X-User-Patient-Id: 

RESPONSE (200):
[
  {
    "id": "64eab8a0-4b8c-45f2-9123-000000000001",
    "patientId": "PAT-001",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1965-05-15",
    "gender": "M",
    "email": "john.doe@example.com",
    "contact": "+1-555-0001",
    "conditions": ["Hypertension"],
    "medications": ["Lisinopril"],
    "allergies": ["Penicillin"],
    "consentProvided": true,
    "hipaaAcknowledged": true,
    "status": "ACTIVE"
  },
  ... 9 more patients
]
```

---

## 🚦 Error Codes & Handling

| Status | Reason | Frontend Action | User Message |
|--------|--------|-----------------|--------------|
| 200 | Success | Display data | None |
| 400 | Bad request | Show error | "Invalid request" |
| 401 | Not authenticated | Redirect to login | "Authentication failed. Please log in again." |
| 403 | Not authorized (role) | Show error | "Only administrators can view all patients." |
| 404 | Not found | Show error | "Patient not found" |
| 500 | Server error | Show error | "Server error. Please try again." |
| 0 | Network error | Show error | "Cannot connect to backend. Ensure Spring Boot is running on http://localhost:8080" |

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│ Browser (localhost:4200)                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  sessionStorage:                                    │
│  {                                                  │
│    "medisphere_auth_user": {                        │
│      "userId": "64eab8a0...",                       │
│      "username": "admin",                           │
│      "role": "ADMIN",                               │
│      "patientId": null,                             │
│      "token": "64eab8a0-123e:admin:ADMIN:..."      │
│    }                                                │
│  }                                                  │
│                                                     │
└─────────────┬──────────────────────────────────────┘
              │
              │ HTTP (CORS enabled for localhost:4200)
              │
┌─────────────┴──────────────────────────────────────┐
│ Spring Boot Backend (localhost:8080)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Context Path: /api                                 │
│  ├─ /auth/login (public)                            │
│  │   └─ AuthController                              │
│  │       └─ Checks: users collection (MongoDB)      │
│  │           ├─ admin/admin123 → ADMIN role         │
│  │           └─ ava.thompson/patient123 → PATIENT   │
│  │                                                   │
│  └─ /v1/** (with header checks)                     │
│      └─ PatientController                           │
│          └─ /patients/list/active                   │
│              ├─ Checks header: X-User-Role == ADMIN │
│              └─ Queries: patients collection         │
│                  └─ Returns: 10 active patients     │
│                                                     │
└─────────────────────────────────────────────────────┘
              │
              ↓
         MongoDB
         ├─ medisphere database
         ├─ users collection (10 docs)
         ├─ patients collection (10 docs)
         └─ other collections
```

---

## 🧪 Test Credentials

| Username | Password | Role | Use Case |
|----------|----------|------|----------|
| admin | admin123 | ADMIN | View all patients |
| ava.thompson | patient123 | PATIENT | View own patient record |

---

## ⚙️ Configuration Summary

### Frontend (`api.config.ts`)
```typescript
API_CONFIG = {
  baseUrl: 'http://localhost:8080',
  basePath: '/api/v1',
  authPath: '/api',
  
  get fullUrl() { return 'http://localhost:8080/api/v1' }
  get authUrl() { return 'http://localhost:8080/api' }
  
  endpoints: {
    auth: '/auth',
    patients: '/patients',
    patientsList: '/patients/list/active',
    ... (etc)
  }
}
```

### Backend (`application.yml`)
```yaml
server:
  port: 8080
  servlet:
    context-path: /api
```

### CORS (`SecurityConfig.java`)
```
Allowed Origins: http://localhost:4200, http://127.0.0.1:4200
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Allowed Headers: Content-Type, Authorization, X-User-Id, X-User-Role, X-User-Patient-Id
Max Age: 3600 seconds
```

---

## 🔍 Debugging Checklist

Run this to verify everything:

```javascript
// 1. Check if user is authenticated
const user = JSON.parse(sessionStorage.getItem('medisphere_auth_user'));
console.log('Authenticated user:', user);
// Expected: { userId, username, role: "ADMIN", token }

// 2. Check API_CONFIG
console.log('API Config:', API_CONFIG);
// Expected: baseUrl, basePath, authPath, fullUrl, authUrl, endpoints

// 3. Check authorization headers (via Network tab)
// GET /api/v1/patients/list/active
// Headers should include:
//   X-User-Role: ADMIN
//   X-User-Id: <value>
//   X-User-Patient-Id: (empty or value)
```

---

## 📱 Component Communication

### Login Flow
```
LoginComponent
  ↓ username, password
  ↓ authService.login()
  ↓ POST /api/auth/login
  ↓ Spring Boot validates
  ↓ Returns: LoginResponse
  ↓ AuthService.setAuthenticatedUser()
  ↓ sessionStorage + BehaviorSubject
  ↓ LoginComponent: navigate('/dashboard')
```

### Dashboard Flow
```
DashboardComponent.ngOnInit()
  ↓ loadPatients()
  ↓ Check: isAuthenticated()
  ↓ Check: hasRole('ADMIN')
  ↓ patientService.getAllActivePatients()
  ↓ GET /api/v1/patients/list/active
  ↓ AuthInterceptor adds headers
  ↓ Spring Boot validates headers
  ↓ PatientController queries MongoDB
  ↓ Returns: Patient[]
  ↓ Dashboard: render table
```

---

## 📝 Verification Checklist

- [ ] Can login with admin/admin123
- [ ] Can see 10 patients in dashboard
- [ ] Network tab shows POST /api/auth/login (200)
- [ ] Network tab shows GET /api/v1/patients/list/active (200)
- [ ] Request headers include X-User-Role, X-User-Id
- [ ] Response is array of 10 Patient objects
- [ ] First patient shown in "Patient 360" section
- [ ] No console errors
- [ ] No "Unable to load patients" error message
- [ ] Refresh page: still shows patients (session persistence)
- [ ] Stop backend: shows "Cannot connect" error
- [ ] Clear sessionStorage: shows "not authenticated" error

---

## 🎓 Key Concepts

### CORS (Cross-Origin Resource Sharing)
- Frontend: `localhost:4200`
- Backend: `localhost:8080`
- Requires explicit CORS configuration (enabled in SecurityConfig)
- Browser automatically includes preflight request (OPTIONS)

### Authentication vs Authorization
- **Authentication**: Verify WHO you are → Login with username/password
- **Authorization**: Verify WHAT you can do → Check X-User-Role header

### Session Management
- **Frontend**: sessionStorage (cleared on browser close)
- **Backend**: Headers (no server-side session needed)
- **Interceptor**: Automatically adds headers from sessionStorage

### Spring Boot Context Path
- Default: `http://localhost:8080/`
- With `/api`: `http://localhost:8080/api/`
- All endpoints prefixed with `/api`

---

## ✨ Summary

**The connection works like this:**

1. User logs in → Frontend stores auth token in sessionStorage
2. Frontend makes API request → AuthInterceptor adds headers from sessionStorage
3. Backend receives request with headers → Validates user role
4. Backend queries MongoDB → Returns patient data
5. Frontend displays data in dashboard

**No fake data. No fake APIs. Real MongoDB data. Real Spring Security.**

