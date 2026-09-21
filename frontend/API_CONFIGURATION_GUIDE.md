# Angular Frontend - API Configuration Guide

## Quick Reference

### Centralized API Configuration

**Location:** `src/app/services/api.config.ts`

All Angular services use a centralized API configuration. This ensures consistency and makes it easy to change the backend URL in one place.

---

## Using the API Configuration

### In a Service

```typescript
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class MyService {
  private apiUrl = `${API_CONFIG.fullUrl}${API_CONFIG.endpoints.patients}`;
  
  constructor(private http: HttpClient) { }
  
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/list/active`);
  }
}
```

### In a Component

```typescript
import { API_CONFIG } from '../../services/api.config';

@Component({
  selector: 'app-dashboard',
  template: `...`
})
export class DashboardComponent implements OnInit {
  async loadPatients(): Promise<void> {
    const response = await fetch(
      `${API_CONFIG.fullUrl}${API_CONFIG.endpoints.patientsList}`
    );
    // ... handle response
  }
}
```

---

## Available Endpoints

All endpoints are defined in `API_CONFIG.endpoints`:

```typescript
API_CONFIG.endpoints = {
  health: '/health/status',
  patients: '/patients',
  patientsList: '/patients/list/active',
  patientStats: '/patients/stats/count',
  vitals: '/vitals',
  vitalsLatest: '/vitals/patient',
  labs: '/labs',
  fhir: '/fhir',
  consents: '/consents',
  consentsList: '/consents/list/active',
  audit: '/audit',
  risk: '/risk',
  predictions: '/risk',
  alerts: '/alerts',
  healthTwins: '/health-twins',
  models: '/models',
  federatedLearning: '/federated-learning',
  explainability: '/explainability',
  carePlans: '/care-plans',
}
```

---

## Changing the Backend URL

If you need to point the frontend to a different backend server:

1. Open: `src/app/services/api.config.ts`
2. Change the `baseUrl`:
   ```typescript
   baseUrl: 'http://new-backend-server:8080',
   ```
3. Rebuild: `npm run build`

All services will automatically use the new URL.

---

## Current Configuration

- **Backend URL:** `http://localhost:8080`
- **API Base:** `http://localhost:8080/api/v1`
- **Frontend URL:** `http://localhost:4200` (when running `npm start`)

---

## Services Using This Configuration

1. **ClinicalDataService** - Labs, FHIR resources, consent data
2. **ExplainabilityService** - SHAP explanations and insights
3. **FederatedLearningService** - Federated model management
4. **HealthTwinService** - Digital health twin operations
5. **ModelService** - ML model management
6. **PatientService** - Patient records management
7. **RiskAlertService** - Risk alerts and notifications
8. **RiskPredictionService** - CVD, diabetes, readmission predictions
9. **VitalsService** - Vital signs data

---

## Health Check

Test the backend connection:

```bash
curl http://localhost:8080/api/v1/health/status
```

Expected response:
```json
{
  "status": "UP",
  "database": "CONNECTED",
  "kafka": "CONNECTED",
  "fhir_api": "READY"
}
```

---

## No Hardcoded URLs

✅ **All relative URLs have been removed:**
- No more `/api/v1/...` paths
- No more scattered `http://localhost` strings
- Everything goes through `API_CONFIG`

✅ **Single source of truth:**
- One file to maintain
- Easy to update
- Version control friendly

---

## Development Tips

- Always import `API_CONFIG` when building URLs
- Use the `getApiUrl()` helper function if needed:
  ```typescript
  import { getApiUrl } from './api.config';
  
  const url = getApiUrl('/patients/list/active');
  ```

- Services automatically handle authentication headers
- The backend enforces CORS and token validation

---

## Production Deployment

Before deploying to production:

1. Update `API_CONFIG.baseUrl` to your production backend URL
2. Ensure CORS is configured on the backend
3. Update any environment-specific configuration
4. Run `npm run build:prod`
5. Deploy the `dist/medisphere` folder

---

*Last Updated: September 11, 2026*
