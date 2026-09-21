import { Routes } from '@angular/router';
import { PatientListComponent } from './pages/patients/patient-list.component';
import { PatientDetailComponent } from './pages/patients/patient-detail.component';
import { HealthTwinComponent } from './pages/health-twin/health-twin.component';
import { VitalsComponent } from './pages/vitals/vitals.component';
import { ConsentComponent } from './pages/consent/consent.component';
import { LoginComponent } from './pages/login/login.component';
import { ClinicalPageComponent } from './pages/clinical-page/clinical-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: ClinicalPageComponent, data: { page: 'dashboard' } },
  { path: 'patients', component: PatientListComponent },
  { path: 'patient/:id', component: PatientDetailComponent },
  { path: 'patients/:id', component: PatientDetailComponent },
  { path: 'health-twin/:patientId', component: HealthTwinComponent },
  { path: 'vitals', component: ClinicalPageComponent, data: { page: 'vitals' } },
  { path: 'vitals/:patientId', component: VitalsComponent },
  { path: 'lab-results', component: ClinicalPageComponent, data: { page: 'labs' } },
  { path: 'fhir-resources', component: ClinicalPageComponent, data: { page: 'fhir' } },
  { path: 'consent', component: ClinicalPageComponent, data: { page: 'consent' } },
  { path: 'consent/:patientId', component: ConsentComponent },
  { path: 'audit', component: ClinicalPageComponent, data: { page: 'audit' } },
  { path: 'predictions', component: ClinicalPageComponent, data: { page: 'predictions' } },
  { path: 'care-plan', component: ClinicalPageComponent, data: { page: 'care-plan' } },
  { path: 'model-management', component: ClinicalPageComponent, data: { page: 'models' } },
  { path: 'federated-learning', component: ClinicalPageComponent, data: { page: 'federated' } },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];
