# MediSphere Cognitive Twin - Frontend

**Angular Patient Portal & AI Dashboard**

## Overview

The frontend provides a professional healthcare portal with:
- Patient 360 dashboard
- Real-time vitals display
- Laboratory results
- FHIR resource viewer
- Consent management
- Audit trail viewer
- Digital Health Twin visualization
- AI Risk Prediction dashboard (Milestone 2)
- Model management (Milestone 2)
- Federated learning status (Milestone 2)

## Technology Stack

- **Framework:** Angular 20
- **Language:** TypeScript 5.8
- **Styling:** SCSS / Bootstrap 5
- **Charts:** Chart.js + ng2-charts
- **3D Visualization:** Three.js
- **Icons:** FontAwesome 6.5

## Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── patients/
│   │   │   ├── vitals/
│   │   │   ├── lab-results/
│   │   │   ├── fhir-resources/
│   │   │   ├── consent/
│   │   │   ├── audit/
│   │   │   ├── health-twin/
│   │   │   ├── risk-prediction/           (Milestone 2)
│   │   │   ├── federated-learning/        (Milestone 2)
│   │   │   └── model-management/          (Milestone 2)
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── sidebar/
│   │   │   ├── patient-card/
│   │   │   ├── vital-card/
│   │   │   ├── status-badge/
│   │   │   └── data-table/
│   │   ├── services/
│   │   │   ├── patient.service.ts
│   │   │   ├── vitals.service.ts
│   │   │   ├── health-twin.service.ts
│   │   │   ├── risk-prediction.service.ts      (Milestone 2)
│   │   │   ├── model.service.ts                (Milestone 2)
│   │   │   ├── federated-learning.service.ts   (Milestone 2)
│   │   │   └── explainability.service.ts       (Milestone 2)
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json                 (Angular configuration)
├── tsconfig.json                (TypeScript configuration)
├── package.json                 (npm dependencies)
├── package-lock.json            (npm lock file)
├── Dockerfile                   (Container image)
└── README.md                    (This file)
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ or yarn
- Angular CLI 20

### Installation

```bash
# Install dependencies
npm install

# Verify Angular CLI
ng version
```

### Development

```bash
# Start dev server
npm start
# or
ng serve

# Application runs at http://localhost:4200
```

### Build

```bash
# Development build
ng build

# Production build
ng build --configuration production

# Output: dist/medisphere-frontend/
```

## Docker

```bash
# Build image
docker build -t medisphere-frontend .

# Run container
docker run -p 4200:4200 medisphere-frontend

# Access at http://localhost:4200
```

## Development

### Adding a New Page

1. Generate component:
   ```bash
   ng generate component pages/my-feature
   ```

2. Create service:
   ```bash
   ng generate service services/my-feature
   ```

3. Add route in `app.routes.ts`:
   ```typescript
   { path: 'my-feature', component: MyFeatureComponent }
   ```

### Services

Located in `src/app/services/`:
- **patient.service.ts** - Patient CRUD operations
- **vitals.service.ts** - Vitals recording and retrieval
- **health-twin.service.ts** - Health Twin operations
- **lab-result.service.ts** - Lab results
- **fhir-resource.service.ts** - FHIR resources
- **consent.service.ts** - Consent management
- **audit.service.ts** - Audit log queries
- **risk-prediction.service.ts** - AI risk predictions (M2)
- **model.service.ts** - Model management (M2)
- **federated-learning.service.ts** - Federated learning (M2)
- **explainability.service.ts** - Explanations (M2)

### API Base URL

Configure in environment files:
- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

Default: `http://localhost:8080/api`

## Routes

```
/                           → Dashboard
/login                      → Login page
/dashboard                  → Patient overview
/patients                   → Patient list
/patients/:id               → Patient details
/health-twin/:patientId    → Health Twin visualization
/vitals/:patientId         → Vitals trend chart
/lab-results               → Lab results
/fhir-resources            → FHIR resource viewer
/consent/:patientId        → Consent management
/audit                     → Audit trail
/risk-prediction           → AI Risk Prediction (M2)
/risk-insights             → Risk insights (M2)
/federated-learning        → Federated learning dashboard (M2)
/model-management          → Model versioning (M2)
```

## Styling

- **Framework:** Bootstrap 5.3
- **Preprocessor:** SCSS
- **Colors:**
  - Primary (Clinical Blue): `#1e40af`
  - Success (Green): `#16a34a`
  - Warning (Yellow): `#ca8a04`
  - Danger (Red): `#dc2626`
  - Info (Cyan): `#0891b2`

## Components

### Shared Components (Reusable)

Located in `src/app/components/`:
- **navbar/** - Top navigation bar
- **sidebar/** - Left sidebar navigation
- **patient-card/** - Patient demographic card
- **vital-card/** - Vital signs display
- **status-badge/** - Risk/status indicator
- **data-table/** - Tabular data display

### Page Components

Located in `src/app/pages/`:
- **login/** - Authentication
- **dashboard/** - Main dashboard (M1)
- **patients/** - Patient management
- **vitals/** - Vitals streaming & trends (M1)
- **lab-results/** - Laboratory results (M1)
- **fhir-resources/** - FHIR resource viewer (M1)
- **consent/** - Consent management (M1)
- **audit/** - Audit trail (M1)
- **health-twin/** - Health Twin visualization (M1)
- **risk-prediction/** - AI risk predictions (M2)
- **federated-learning/** - Federated learning (M2)
- **model-management/** - Model versioning (M2)

## Security

- JWT token-based authentication
- Stored in localStorage (with refresh)
- HIPAA-compliant consent verification
- Audit logging of all user actions
- HTTPS recommended for production

## Testing

```bash
# Run unit tests
ng test

# Run end-to-end tests
ng e2e

# Generate coverage report
ng test --code-coverage
```

## Performance

### Optimization

- Lazy loading of routes
- Change detection strategy: OnPush
- Virtual scrolling for large lists
- Image optimization

### Build Optimization

```bash
# Production build with optimizations
ng build --configuration production

# Check bundle size
npm run webpack-bundle-analyzer
```

## Troubleshooting

### Port 4200 Already in Use
```bash
ng serve --port 4300
```

### CORS Issues
- Verify backend API is running
- Check `proxy.conf.json` configuration
- Ensure API URL matches backend

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Angular cache
ng cache clean

# Rebuild
ng build
```

## Deployment

### Development Deployment
```bash
npm start
# Runs on http://localhost:4200
```

### Production Build
```bash
ng build --configuration production
# Output in dist/medisphere-frontend/
```

### Docker Deployment
```bash
docker build -t medisphere-frontend .
docker run -p 4200:4200 medisphere-frontend
```

### Static Hosting
Upload contents of `dist/medisphere-frontend/` to:
- Nginx
- Apache
- CDN
- Cloud storage (AWS S3, GCS, etc.)

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Dependencies

See `package.json` for complete list:
- Angular 20
- Bootstrap 5.3
- Chart.js 4.4
- Three.js 0.128
- RxJS 7.8
- TypeScript 5.8

## Support

See `../TESTING_GUIDE.md` for API integration examples.
See `../MILESTONE_2_README.md` for feature documentation.

---

**MediSphere Cognitive Twin - Frontend Portal**
**Version:** 2.0.0 (Milestone 1 + 2)
