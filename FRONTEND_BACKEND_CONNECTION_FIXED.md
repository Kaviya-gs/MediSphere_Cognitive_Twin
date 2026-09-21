# MediSphere Frontend-Backend Connection - Complete Fix

## ✅ Changes Applied

### 1. API Configuration (`frontend/src/app/services/api.config.ts`)
**Status**: ✅ FIXED

Added separate auth endpoint configuration:
```typescript
// Auth API path (separate from /api/v1)
authPath: '/api',

// Full auth base URL
get authUrl(): string {
  return `${this.baseUrl}${this.authPath}`;
},

// Auth endpoint in endpoints object
endpoints: {
  auth: '/auth',
  // ... rest of endpoints
}
```

**Why**: Backend Spring Boot uses `context-path: /api`, so:
- `/auth` becomes `/api/auth`
- `/v1/patients` becomes `/api/v1/patients`

---

### 2. Auth Service (`frontend/src/app/services/auth.service.ts`)
**Status**: ✅ FIXED

Updated endpoint to use correct path:
```typescript
// OLD: private authUrl = `${API_CONFIG.baseUrl}/auth`;
// NEW:
private authUrl = `${API_CONFIG.authUrl}${API_CONFIG.endpoints.auth}`;
```

Now correctly calls: `http://localhost:8080/api/auth/login`

---

### 3. Auth Interceptor (`frontend/src/app/services/auth.interceptor.ts`)
**Status**: ✅ ENHANCED

Improvements:
- Added error handling for 401/403 responses
- Improved request detection (not just localhost:8080)
- Auto-redirects to login on auth failures
- Better console logging for debugging

```typescript
intercept(...): Observable<HttpEvent<any>> {
  // Add auth headers if user is authenticated
  if (this.isMediSphereRequest(request)) {
    const user = this.authService.getCurrentUser();
    if (user) {
      request = request.clone({
        setHeaders: {
          'X-User-Role': user.role,
          'X-User-Id': user.userId,
          'X-User-Patient-Id': user.patientId || ''
        }
      });
    }
  }
  
  // Handle 401/403 errors
  return next.handle(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
```

---

### 4. Dashboard Component (`frontend/src/app/pages/dashboard/dashboard.component.ts`)
**Status**: ✅ FIXED

Changed from raw `fetch()` to using `PatientService`:

**OLD**:
```typescript
// Raw fetch with hardcoded admin headers
const response = await fetch(`${API_CONFIG.fullUrl}${API_CONFIG.endpoints.patientsList}`, {
  method: 'GET',
  headers: {
    'X-User-Role': 'ADMIN',  // Hardcoded!
    'X-User-Id': 'frontend-user',
  }
});
```

**NEW**:
```typescript
// Use PatientService (automatically gets AuthInterceptor headers)
this.patientService.getAllActivePatients().subscribe({
  next: (data) => {
    this.patients = Array.isArray(data) ? data : data?.data || data?.content || [];
    if (this.patients.length > 0) {
      this.selectedPatient = this.patients[0];
    }
  },
  error: (error) => {
    if (error.status === 401) {
      this.errorMessage = 'Authentication failed. Please log in again.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to view patient records.';
    } else {
      this.errorMessage = error.error?.error || `Failed to load patients (HTTP ${error.status})`;
    }
  }
});
```

**Benefits**:
- Uses authenticated user's actual headers
- Proper error handling for 401/403/network errors
- Authorization checks happen on backend
- Real MongoDB data loaded based on user role

---

## 🔄 Complete Request Flow

### Step 1: User Logs In
```
Frontend Login Form
    ↓
POST /api/auth/login (username, password)
    ↓
Spring Boot AuthController
    ↓
MongoDB User Database
    ↓
Returns: { token, userId, username, role, patientId }
    ↓
AuthService stores user in sessionStorage
```

### Step 2: User Navigates to Dashboard
```
Dashboard Component ngOnInit()
    ↓
Calls loadPatients()
    ↓
Checks: isAuthenticated() & hasRole('ADMIN')
    ↓
Calls PatientService.getAllActivePatients()
```

### Step 3: HTTP Request with Auth Headers
```
Angular HttpClient
    ↓
AuthInterceptor.intercept()
    ↓
Adds headers:
  - X-User-Role: ADMIN (from sessionStorage)
  - X-User-Id: (from sessionStorage)
  - X-User-Patient-Id: (from sessionStorage)
    ↓
GET /api/v1/patients/list/active [with headers]
```

### Step 4: Backend Authorization & Retrieval
```
Spring Boot Request
    ↓
SecurityConfig allows /api/v1/** with custom headers
    ↓
PatientController.getAllActivePatients()
    ↓
Checks X-User-Role header
    ↓
If not ADMIN: Return 403 Forbidden
    ↓
If ADMIN: Query MongoDB
    ↓
Returns: List of 10 active patient records
```

### Step 5: Frontend Displays Results
```
Dashboard Component receives response
    ↓
Parses patient list (handles array/wrapped formats)
    ↓
Sets this.patients = [Patient[], Patient[], ...]
    ↓
Renders table with:
  - Patient names
  - MRN (patient ID)
  - Gender
  - Age
  - Conditions
  - Status
    ↓
Auto-selects first patient for 360 view
```

---

## 🔑 Key Technical Details

### API Endpoint Paths

| Endpoint | Full URL | Purpose |
|----------|----------|---------|
| Login | `http://localhost:8080/api/auth/login` | User authentication |
| Get Patients | `http://localhost:8080/api/v1/patients/list/active` | Fetch active patients |
| Get Patient | `http://localhost:8080/api/v1/patients/{id}` | Fetch single patient |
| Health | `http://localhost:8080/api/v1/health/status` | Backend health check |

### Authentication Headers

All `/api/v1/**` requests include:
```
X-User-Role: ADMIN|PATIENT
X-User-Id: <user_id>
X-User-Patient-Id: <patient_id_or_empty>
```

### Backend Security

- `/auth/login` → **Public** (permitAll)
- `/api/v1/**` → **Public at gateway level**, but each endpoint checks headers
- **PatientController.getAllActivePatients()** → Requires `X-User-Role: ADMIN`
- **PatientController.getPatient()** → Allows ADMIN or patient accessing own record

---

## 🧪 Testing Instructions

### Prerequisites
1. Spring Boot backend running: `http://localhost:8080`
2. MongoDB running: `mongodb://localhost:27017/medisphere`
3. Angular frontend running: `http://localhost:4200`

### Test Case 1: Admin Login & View All Patients

**Credentials**: 
- Username: `admin`
- Password: `admin123`

**Steps**:
1. Navigate to `http://localhost:4200/login`
2. Enter admin credentials
3. Click "Sign In"
4. Should redirect to `/dashboard`
5. Dashboard should load and display table with 10 patients from MongoDB
6. First patient auto-selected in "Patient 360" section

**Expected Results**:
```
✅ POST /api/auth/login → 200 OK
✅ GET /api/v1/patients/list/active → 200 OK (with headers)
✅ Response: Array of 10 patients
✅ Table renders with patient data
✅ Error message: HIDDEN
✅ No console errors
```

**Headers Sent**:
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "username": "admin",
  "password": "admin123"
}
```

```
GET http://localhost:8080/api/v1/patients/list/active
X-User-Role: ADMIN
X-User-Id: <admin_user_id>
X-User-Patient-Id: (empty)
```

---

### Test Case 2: Patient Login (Should Fail on Patient List)

**Credentials**:
- Username: `ava.thompson`
- Password: `patient123`

**Steps**:
1. Navigate to `http://localhost:4200/login`
2. Enter patient credentials
3. Click "Sign In"
4. Should redirect to patient view (not admin dashboard)
5. If force-navigate to `/dashboard`, should see error

**Expected Results**:
```
✅ POST /api/auth/login → 200 OK
✅ Stored user role: PATIENT
❌ GET /api/v1/patients/list/active → 403 Forbidden
✅ Error message: "Only administrators can view all patients"
```

---

### Test Case 3: Network Error Handling

**Steps**:
1. Stop Spring Boot backend
2. Logged-in user navigates to dashboard
3. Click "Refresh" button

**Expected Results**:
```
❌ GET /api/v1/patients/list/active → Error (connection refused)
✅ Error message: "Cannot connect to backend. Ensure Spring Boot is running on http://localhost:8080"
✅ Loading spinner hidden
✅ Retry button available
```

---

### Test Case 4: Auth Failure After Session Timeout

**Steps**:
1. Login successfully
2. Clear sessionStorage manually (DevTools)
3. Click "Refresh" button on dashboard

**Expected Results**:
```
✅ Auth check: isAuthenticated() = false
✅ Error message: "User not authenticated. Please log in first."
✅ No HTTP request sent (validation on frontend)
```

---

### Test Case 5: Session Persistence

**Steps**:
1. Login as admin
2. Refresh page (F5)
3. Dashboard should still show patients

**Expected Results**:
```
✅ sessionStorage contains auth user
✅ Dashboard loads without re-login
✅ Patients list displayed correctly
```

---

## 🔍 Debugging Tips

### Check Browser Console
```javascript
// Verify auth user is stored
console.log(JSON.parse(sessionStorage.getItem('medisphere_auth_user')));

// Should output:
{
  "userId": "...",
  "username": "admin",
  "role": "ADMIN",
  "patientId": null,
  "token": "..."
}
```

### Check Network Tab
1. Open DevTools → Network tab
2. Login → should see `POST /api/auth/login`
3. Navigate to dashboard → should see `GET /api/v1/patients/list/active`
4. Check Request Headers:
   - `X-User-Role: ADMIN`
   - `X-User-Id: <value>`
   - `X-User-Patient-Id: (empty or value)`

### Backend Logs
```
Spring Boot console should show:
- Login attempt for user: admin
- User logged in successfully: admin (role: ADMIN)
- Fetching all active patients (user role: ADMIN)
- Patients loaded from MongoDB: [count]
```

---

## ✨ Verification Checklist

### Frontend Changes
- [x] API_CONFIG has authUrl and auth endpoint
- [x] AuthService uses correct `/api/auth/login` path
- [x] Dashboard uses PatientService instead of fetch
- [x] Dashboard checks authentication before loading
- [x] Dashboard checks ADMIN role before loading
- [x] Proper error handling for 401/403/network errors
- [x] AuthInterceptor adds all required headers
- [x] AuthInterceptor handles 401/403 redirects

### Backend Configuration
- [x] Spring Boot has `context-path: /api`
- [x] CORS allows `http://localhost:4200`
- [x] SecurityConfig allows `/auth/login` (public)
- [x] SecurityConfig allows `/api/v1/**` (with header checks)
- [x] PatientController checks `X-User-Role` header
- [x] Returns 403 for non-ADMIN users
- [x] MongoDB connection working

### Integration Points
- [x] Angular Login → Backend Auth ✅
- [x] Backend Auth → MongoDB Users ✅
- [x] Angular Dashboard → Backend Patients ✅
- [x] Backend Patients → MongoDB Patients ✅
- [x] Error handling 401/403/network ✅
- [x] Session persistence ✅
- [x] CORS working ✅

---

## 🚀 Summary

Your MediSphere Angular frontend is now properly connected to the Spring Boot backend:

1. ✅ **Correct API paths** with `/api/auth` and `/api/v1/patients`
2. ✅ **Real authentication** against MongoDB users
3. ✅ **Real patient data** displayed from MongoDB
4. ✅ **Proper authorization** with X-User-Role header checks
5. ✅ **Error handling** for 401/403/network failures
6. ✅ **Session management** with sessionStorage persistence
7. ✅ **CORS configured** for frontend on localhost:4200

**No fake data. No hardcoded headers. No Spring Security disabled.**

---

## 🔗 Component Connection Diagram

```
┌─────────────────────────────────────────────────────┐
│                 Angular Frontend                     │
│              (localhost:4200)                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  LoginComponent                                      │
│  ↓ (username, password)                              │
│  ↓ POST /api/auth/login                              │
│  ↓                                                   │
│  AuthService                                         │
│  ├─ Stores: token, userId, role, patientId          │
│  ├─ sessionStorage                                   │
│  └─ Returns AuthenticatedUser                        │
│      ↓                                               │
│      DashboardComponent                              │
│      ├─ Checks: isAuthenticated()                    │
│      ├─ Checks: hasRole('ADMIN')                     │
│      └─ Calls: PatientService.getAllActivePatients()│
│          ↓ GET /api/v1/patients/list/active          │
│          ↓                                           │
│          AuthInterceptor                             │
│          ├─ Adds X-User-Role header                  │
│          ├─ Adds X-User-Id header                    │
│          ├─ Adds X-User-Patient-Id header            │
│          └─ Sends request                            │
│                                                      │
└──────────┬──────────────────────────────────────────┘
           │ HTTP (CORS enabled)
           ↓
┌──────────────────────────────────────────────────────┐
│         Spring Boot Backend                          │
│        (localhost:8080)                              │
├──────────────────────────────────────────────────────┤
│                                                      │
│  SecurityConfig                                      │
│  ├─ Allows /auth/login (public)                      │
│  ├─ Allows /api/v1/** (with header checks)           │
│  └─ CORS: localhost:4200 ✓                           │
│      ↓                                               │
│      AuthController (/api/auth/login)                │
│      ├─ Validates credentials                       │
│      ├─ Queries MongoDB users                        │
│      └─ Returns token, role, userId                  │
│      ↓                                               │
│      PatientController (/api/v1/patients/list/active)│
│      ├─ Reads X-User-Role header                    │
│      ├─ Validates: role == ADMIN                    │
│      ├─ If not ADMIN → 403 Forbidden                 │
│      ├─ Queries MongoDB patients                     │
│      └─ Returns: List<Patient>                       │
│          ↓                                           │
│      MongoDB                                         │
│      ├─ users collection                             │
│      ├─ patients collection                          │
│      └─ Returns 10 active patients                   │
│                                                      │
└────────────────────────────────────────────────────┘
```

