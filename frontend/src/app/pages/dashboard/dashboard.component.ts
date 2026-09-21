import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { API_CONFIG } from '../../services/api.config';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { HealthTwinService } from '../../services/health-twin.service';
import { ClinicalDataService } from '../../services/clinical-data.service';
import { RiskAlertService } from '../../services/risk-alert.service';

interface Patient {
  id?: string;
  patientId?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  contact?: string;
  email?: string;
  conditions?: string[];
  medications?: string[];
  allergies?: string[];
  consentProvided?: boolean;
  hipaaAcknowledged?: boolean;
  status?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],

  template: `
    <section class="dashboard-shell">

      <!-- PAGE HEADER -->
      <div class="page-heading">
        <div>
          <p class="eyebrow">MEDISPHERE CLINICAL WORKSPACE</p>
          <h1>Overview</h1>
          <p class="subtitle">
            A connected view of patient activity and clinical signals.
          </p>
        </div>

        <div class="demo-pill">
          <span class="pulse"></span>
          MongoDB Connected
        </div>
      </div>


      <!-- METRICS -->
      <div class="metric-grid">

        <article class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-users"></i>
          </div>

          <div>
            <p>Total patients</p>
            <strong>{{ patients.length }}</strong>
            <small>MongoDB active records</small>
          </div>
        </article>


        <article class="metric-card">
          <div class="metric-icon heart">
            <i class="fas fa-heart-pulse"></i>
          </div>

          <div>
            <p>Active health twins</p>
            <strong>{{ totalHealthTwins }}</strong>
            <small>Twin service status</small>
          </div>
        </article>


        <article class="metric-card">
          <div class="metric-icon database">
            <i class="fas fa-database"></i>
          </div>

          <div>
            <p>FHIR resources</p>
            <strong>{{ totalFhirResources }}</strong>
            <small>Validated and synced</small>
          </div>
        </article>


        <article class="metric-card">
          <div class="metric-icon alert">
            <i class="fas fa-triangle-exclamation"></i>
          </div>

          <div>
            <p>Active alerts</p>
            <strong>{{ totalActiveAlerts }}</strong>
            <small>Review required</small>
          </div>
        </article>

      </div>


      <!-- RECENT PATIENTS -->
      <section class="patient-list-panel">

        <div class="panel-heading">

          <div>
            <h2>Recent patients</h2>
            <p>Active patient records from MongoDB</p>
          </div>

          <button class="refresh-btn" (click)="loadPatients()">
            <i class="fas fa-rotate"></i>
            Refresh
          </button>

        </div>


        <!-- LOADING -->
        <div class="message" *ngIf="loading">
          <i class="fas fa-spinner fa-spin"></i>
          Loading patients...
        </div>


        <!-- ERROR -->
        <div class="error-message" *ngIf="errorMessage && !loading">
          <i class="fas fa-circle-exclamation"></i>
          {{ errorMessage }}

          <button class="retry-btn" (click)="loadPatients()">
            Retry
          </button>
        </div>


        <!-- PATIENT TABLE -->
        <div class="table-container"
             *ngIf="!loading && !errorMessage && patients.length > 0">

          <table>

            <thead>
              <tr>
                <th>Patient</th>
                <th>MRN</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              <tr *ngFor="let patient of patients">

                <!-- PATIENT -->
                <td>
                  <div class="patient-cell">

                    <div class="avatar">
                      {{ getInitials(patient) }}
                    </div>

                    <div>
                      <strong>
                        {{ getPatientName(patient) }}
                      </strong>

                      <small>
                        {{ patient.email || 'No email available' }}
                      </small>
                    </div>

                  </div>
                </td>


                <!-- MRN -->
                <td>
                  <span class="mrn">
                    {{ patient.patientId || patient.id || 'N/A' }}
                  </span>
                </td>


                <!-- GENDER -->
                <td>
                  {{ formatGender(patient.gender) }}
                </td>


                <!-- AGE -->
                <td>
                  {{ calculateAge(patient.dateOfBirth) }}
                </td>


                <!-- CONDITION -->
                <td>
                  <span class="condition"
                        *ngIf="patient.conditions?.length">
                    {{ patient.conditions![0] }}
                  </span>

                  <span class="no-data"
                        *ngIf="!patient.conditions?.length">
                    No condition
                  </span>
                </td>


                <!-- STATUS -->
                <td>
                  <span class="status-badge">
                    <span class="status-dot"></span>
                    {{ patient.status || 'ACTIVE' }}
                  </span>
                </td>


                <!-- ACTION -->
                <td>
                  <button
                    class="view-btn"
                    (click)="viewPatient(patient)">

                    <i class="fas fa-eye"></i>
                    View Patient

                  </button>
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        <!-- EMPTY -->
        <div class="empty-state"
             *ngIf="!loading && !errorMessage && patients.length === 0">

          <i class="fas fa-user-group"></i>

          <h3>No patient records found</h3>

          <p>
            No active patient records were returned by the API.
          </p>

          <button class="retry-btn" (click)="loadPatients()">
            Refresh Patients
          </button>

        </div>

      </section>


      <!-- SELECTED PATIENT -->
      <section class="patient-panel"
               *ngIf="selectedPatient">

        <div class="panel-heading">

          <div>
            <p class="eyebrow">SELECTED PATIENT</p>

            <h2>
              Patient 360
              <span>·</span>
              {{ getPatientName(selectedPatient) }}
            </h2>
          </div>

          <span class="status-chip">
            <i class="fas fa-circle"></i>
            Active
          </span>

        </div>


        <div class="patient-content">

          <!-- PATIENT SUMMARY -->
          <div class="patient-summary">

            <div class="large-avatar">
              {{ getInitials(selectedPatient) }}
            </div>

            <div>

              <h3>
                {{ getPatientName(selectedPatient) }}
              </h3>

              <p>
                {{ selectedPatient.patientId || selectedPatient.id }}
                ·
                {{ calculateAge(selectedPatient.dateOfBirth) }} years
                ·
                {{ formatGender(selectedPatient.gender) }}
              </p>

              <span class="risk-badge">
                <i class="fas fa-shield-heart"></i>
                Health Twin Active
              </span>

            </div>

          </div>


          <!-- PATIENT VITALS -->
          <div class="vitals-strip">

            <div class="vital">

              <span>Patient ID</span>

              <strong>
                {{ selectedPatient.patientId || selectedPatient.id }}
              </strong>

              <small>MongoDB record</small>

            </div>


            <div class="vital">

              <span>Condition</span>

              <strong>
                {{ selectedPatient.conditions?.[0] || 'None' }}
              </strong>

              <small>Clinical record</small>

            </div>


            <div class="vital">

              <span>Consent</span>

              <strong>
                {{ selectedPatient.consentProvided ? 'Granted' : 'Pending' }}
              </strong>

              <small>
                {{ selectedPatient.consentProvided
                  ? 'Patient consent available'
                  : 'Consent required' }}
              </small>

            </div>


            <div class="vital">

              <span>HIPAA</span>

              <strong>
                {{ selectedPatient.hipaaAcknowledged ? 'Acknowledged' : 'Pending' }}
              </strong>

              <small>Compliance status</small>

            </div>

          </div>


          <!-- DETAILS -->
          <div class="detail-grid">

            <div class="detail-block">

              <span class="detail-label">
                CONDITIONS
              </span>

              <strong>
                {{ selectedPatient.conditions?.join(' · ') || 'No conditions recorded' }}
              </strong>

              <p>
                Clinical conditions tracked in the patient record
              </p>

            </div>


            <div class="detail-block">

              <span class="detail-label">
                ACTIVE MEDICATIONS
              </span>

              <strong>
                {{ selectedPatient.medications?.join(' · ') || 'No medications recorded' }}
              </strong>

              <p>
                Medication information from MongoDB
              </p>

            </div>


            <div class="detail-block">

              <span class="detail-label">
                ALLERGIES
              </span>

              <strong>
                {{ selectedPatient.allergies?.join(' · ') || 'No known allergies' }}
              </strong>

              <p>
                Patient allergy information
              </p>

            </div>


            <div class="detail-block">

              <span class="detail-label">
                DIGITAL HEALTH TWIN
              </span>

              <strong class="success-text">
                <i class="fas fa-check-circle"></i>
                Connected
              </strong>

              <div class="progress-track">
                <span style="width: 100%"></span>
              </div>

            </div>

          </div>

        </div>


        <!-- ACTIONS -->
        <div class="panel-actions">

          <button
            class="primary-action"
            (click)="viewPatient(selectedPatient)">

            <i class="fas fa-user"></i>
            Open Patient 360

          </button>


          <button>
            <i class="fas fa-chart-line"></i>
            View Timeline
          </button>


          <button>
            <i class="fas fa-shield-heart"></i>
            Run Prediction
          </button>


          <span class="updated">
            <i class="fas fa-database"></i>
            Data loaded from MongoDB
          </span>

        </div>

      </section>


      <!-- LOWER CARDS -->
      <div class="lower-grid">

        <section class="info-card">

          <div class="card-heading">

            <h3>
              <i class="fas fa-wave-square"></i>
              Streaming signals
            </h3>

            <span>LIVE</span>

          </div>


          <div class="signal-row">

            <span class="signal-dot green"></span>

            <strong>Wearable vitals</strong>

            <small>
              Kafka stream
            </small>

          </div>


          <div class="signal-row">

            <span class="signal-dot blue"></span>

            <strong>FHIR resources</strong>

            <small>
              R4 synchronized
            </small>

          </div>


          <div class="signal-row">

            <span class="signal-dot green"></span>

            <strong>MongoDB</strong>

            <small>
              Connected
            </small>

          </div>

        </section>


        <section class="info-card">

          <div class="card-heading">

            <h3>
              <i class="fas fa-clipboard-check"></i>
              Validation status
            </h3>

            <span>CONNECTED</span>

          </div>


          <p class="validation-copy">
            MediSphere clinical foundations are connected
            and patient data is available from MongoDB.
          </p>


          <div class="validation-tags">

            <span>FHIR R4</span>
            <span>MongoDB</span>
            <span>HIPAA Audit</span>
            <span>Kafka Stream</span>

          </div>

        </section>

      </div>

    </section>
  `,

  styles: [`

    :host {
      display: block;
      min-height: 100%;
      background: #f5f8fb;
    }


    .dashboard-shell {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 40px 60px;
      color: #19324d;
    }


    /* HEADER */

    .page-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }


    .eyebrow {
      color: #119ab3;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .12em;
      margin: 0 0 7px;
    }


    h1 {
      font-size: 32px;
      color: #132f4c;
      margin: 0 0 5px;
      font-weight: 700;
    }


    .subtitle {
      color: #71839a;
      margin: 0;
      font-size: 14px;
    }


    .demo-pill {
      border: 1px solid #cce5eb;
      background: #ffffff;
      color: #138aa0;
      border-radius: 20px;
      padding: 9px 15px;
      font-size: 12px;
      font-weight: 600;
    }


    .pulse {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #21b477;
      border-radius: 50%;
      margin-right: 7px;
    }


    /* METRICS */

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 22px;
    }


    .metric-card {
      background: #ffffff;
      border: 1px solid #dce6ef;
      border-radius: 9px;
      padding: 20px;
      display: flex;
      gap: 15px;
      min-height: 105px;
      box-shadow: 0 2px 8px rgba(30, 70, 100, .06);
    }


    .metric-card p {
      color: #71839a;
      font-size: 12px;
      margin: 0 0 5px;
    }


    .metric-card strong {
      display: block;
      color: #173c5d;
      font-size: 25px;
      margin-bottom: 5px;
    }


    .metric-card small {
      color: #27a78b;
      font-size: 11px;
    }


    .metric-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: #139db5;
      background: #e7f6f8;
      flex-shrink: 0;
    }


    .metric-icon.heart {
      color: #168aa5;
    }


    .metric-icon.database {
      color: #2388a9;
    }


    .metric-icon.alert {
      color: #e19a28;
      background: #fff6e4;
    }


    /* PATIENT TABLE */

    .patient-list-panel,
    .patient-panel,
    .info-card {
      background: #ffffff;
      border: 1px solid #dce6ef;
      border-radius: 9px;
      box-shadow: 0 2px 8px rgba(30, 70, 100, .06);
    }


    .panel-heading {
      padding: 20px 22px;
      border-bottom: 1px solid #e3eaf1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }


    .panel-heading h2 {
      color: #173b5c;
      font-size: 19px;
      margin: 0 0 4px;
    }


    .panel-heading p {
      color: #8495a8;
      font-size: 12px;
      margin: 0;
    }


    .refresh-btn,
    .retry-btn {
      background: #ffffff;
      color: #168eaa;
      border: 1px solid #b9dfe8;
      border-radius: 6px;
      padding: 8px 13px;
      cursor: pointer;
      font-size: 12px;
    }


    .refresh-btn:hover,
    .retry-btn:hover {
      background: #edf9fb;
    }


    .table-container {
      overflow-x: auto;
    }


    table {
      width: 100%;
      border-collapse: collapse;
    }


    th {
      background: #f7fafc;
      color: #647991;
      font-size: 11px;
      font-weight: 700;
      text-align: left;
      padding: 13px 15px;
      border-bottom: 1px solid #dfe7ee;
      white-space: nowrap;
    }


    td {
      padding: 15px;
      border-bottom: 1px solid #edf1f5;
      color: #405a73;
      font-size: 12px;
      white-space: nowrap;
    }


    tbody tr:hover {
      background: #f8fcfd;
    }


    .patient-cell {
      display: flex;
      align-items: center;
      gap: 11px;
    }


    .patient-cell strong {
      display: block;
      color: #1c4566;
      font-size: 13px;
      margin-bottom: 3px;
    }


    .patient-cell small {
      color: #8a9aac;
      font-size: 10px;
    }


    .avatar,
    .large-avatar {
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #e4f5f8;
      color: #128fa9;
      font-weight: 800;
    }


    .avatar {
      width: 36px;
      height: 36px;
      font-size: 12px;
    }


    .mrn {
      color: #28718d;
      font-weight: 600;
    }


    .condition {
      background: #eef7fa;
      color: #26718b;
      padding: 5px 8px;
      border-radius: 5px;
      font-size: 10px;
    }


    .no-data {
      color: #9aa7b4;
    }


    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #21936d;
      background: #eaf8f2;
      padding: 5px 9px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
    }


    .status-dot {
      width: 6px;
      height: 6px;
      background: #2bbb83;
      border-radius: 50%;
    }


    .view-btn {
      border: 1px solid #b8dfe8;
      background: #ffffff;
      color: #168da8;
      padding: 7px 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 10px;
      font-weight: 600;
    }


    .view-btn:hover {
      background: #eaf8fa;
    }


    /* MESSAGES */

    .message,
    .empty-state,
    .error-message {
      text-align: center;
      padding: 45px 20px;
      color: #71849a;
      font-size: 13px;
    }


    .message i {
      margin-right: 8px;
      color: #159bb4;
    }


    .empty-state i {
      color: #9eb8c7;
      font-size: 30px;
      margin-bottom: 12px;
    }


    .empty-state h3 {
      color: #38556e;
      margin: 0 0 5px;
    }


    .empty-state p {
      margin: 0 0 15px;
    }


    .error-message {
      color: #c65353;
    }


    /* SELECTED PATIENT */

    .patient-panel {
      margin-top: 20px;
    }


    .status-chip {
      color: #21936d;
      background: #eaf8f2;
      border: 1px solid #c4eadb;
      border-radius: 20px;
      padding: 7px 12px;
      font-size: 11px;
      font-weight: 700;
    }


    .status-chip i {
      font-size: 7px;
      margin-right: 5px;
    }


    .patient-content {
      padding: 23px;
    }


    .patient-summary {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 22px;
    }


    .large-avatar {
      width: 58px;
      height: 58px;
      font-size: 18px;
    }


    .patient-summary h3 {
      color: #183d5c;
      font-size: 18px;
      margin: 0 0 4px;
    }


    .patient-summary p {
      color: #7d8fa2;
      font-size: 11px;
      margin: 0 0 8px;
    }


    .risk-badge {
      color: #218d70;
      background: #eaf8f2;
      border: 1px solid #c6e9dd;
      padding: 5px 9px;
      border-radius: 5px;
      font-size: 10px;
    }


    .vitals-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: 1px solid #e4eaf0;
      border-bottom: 1px solid #e4eaf0;
      padding: 18px 0;
      margin-bottom: 22px;
    }


    .vital {
      padding: 0 18px;
      border-right: 1px solid #e4eaf0;
    }


    .vital:first-child {
      padding-left: 0;
    }


    .vital:last-child {
      border-right: 0;
    }


    .vital span {
      display: block;
      color: #8495a8;
      font-size: 10px;
      margin-bottom: 5px;
    }


    .vital strong {
      display: block;
      color: #244761;
      font-size: 14px;
      margin-bottom: 4px;
    }


    .vital small {
      color: #2ba77f;
      font-size: 9px;
    }


    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px 35px;
    }


    .detail-label {
      display: block;
      color: #8495a8;
      font-size: 9px;
      letter-spacing: .08em;
      margin-bottom: 6px;
      font-weight: 700;
    }


    .detail-block strong {
      display: block;
      color: #36536c;
      font-size: 12px;
    }


    .detail-block p {
      color: #8797a8;
      font-size: 10px;
      margin: 5px 0 0;
    }


    .success-text {
      color: #21936d !important;
    }


    .success-text i {
      margin-right: 5px;
    }


    .progress-track {
      height: 5px;
      background: #e8eef3;
      margin-top: 10px;
      border-radius: 5px;
      overflow: hidden;
    }


    .progress-track span {
      display: block;
      height: 100%;
      background: #28ad88;
    }


    .panel-actions {
      display: flex;
      gap: 9px;
      align-items: center;
      padding: 14px 23px;
      border-top: 1px solid #e3eaf0;
    }


    .panel-actions button {
      color: #4c657d;
      background: #ffffff;
      border: 1px solid #cfdce6;
      border-radius: 5px;
      padding: 8px 11px;
      font-size: 10px;
      cursor: pointer;
    }


    .panel-actions button:hover,
    .panel-actions .primary-action {
      color: #ffffff;
      background: #158fac;
      border-color: #158fac;
    }


    .panel-actions i {
      margin-right: 5px;
    }


    .updated {
      margin-left: auto;
      color: #8293a5;
      font-size: 10px;
    }


    /* LOWER CARDS */

    .lower-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 20px;
    }


    .info-card {
      padding: 20px;
    }


    .card-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }


    .card-heading h3 {
      color: #244762;
      font-size: 13px;
      margin: 0 0 12px;
    }


    .card-heading h3 i {
      color: #1599b2;
      margin-right: 7px;
    }


    .card-heading > span {
      color: #28a37e;
      font-size: 9px;
      font-weight: 800;
    }


    .signal-row {
      display: grid;
      grid-template-columns: 9px 1fr auto;
      gap: 9px;
      align-items: center;
      padding: 9px 0;
      border-top: 1px solid #edf1f4;
      font-size: 11px;
    }


    .signal-row small {
      color: #8a99a9;
      font-size: 9px;
    }


    .signal-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }


    .green {
      background: #35b687;
    }


    .blue {
      background: #2998b4;
    }


    .validation-copy {
      color: #7d8ea0;
      font-size: 10px;
      line-height: 1.6;
      margin-bottom: 13px;
    }


    .validation-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }


    .validation-tags span {
      color: #287c94;
      border: 1px solid #cce4ea;
      background: #f0fafb;
      border-radius: 4px;
      padding: 5px 8px;
      font-size: 9px;
    }


    /* RESPONSIVE */

    @media (max-width: 1000px) {

      .metric-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .vitals-strip {
        grid-template-columns: repeat(2, 1fr);
      }

      .vital {
        margin-bottom: 15px;
      }

    }


    @media (max-width: 700px) {

      .dashboard-shell {
        padding: 20px 15px 40px;
      }

      .page-heading {
        align-items: flex-start;
        flex-direction: column;
      }

      .metric-grid,
      .lower-grid,
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .vitals-strip {
        grid-template-columns: 1fr;
      }

      .vital {
        border-right: 0;
        padding: 10px 0;
        border-bottom: 1px solid #edf1f4;
      }

      .vital:last-child {
        border-bottom: 0;
      }

      .panel-actions {
        flex-wrap: wrap;
      }

      .updated {
        width: 100%;
        margin-left: 0;
      }

    }

  `]
})
export class DashboardComponent implements OnInit {

  patients: Patient[] = [];

  selectedPatient: Patient | null = null;

  loading = false;

  errorMessage = '';

  totalHealthTwins = 0;
  totalFhirResources = 0;
  totalActiveAlerts = 0;

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private healthTwinService: HealthTwinService,
    private clinicalDataService: ClinicalDataService,
    private riskAlertService: RiskAlertService
  ) { }


  ngOnInit(): void {
    this.loadDashboardMetrics();
    this.loadPatients();
  }

  private loadDashboardMetrics(): void {
    this.healthTwinService.countTotalTwins().subscribe({
      next: count => this.totalHealthTwins = count,
      error: () => this.totalHealthTwins = 0
    });

    this.clinicalDataService.getResources().subscribe({
      next: resources => this.totalFhirResources = resources.length,
      error: () => this.totalFhirResources = 0
    });

    this.riskAlertService.getAllActiveAlerts().subscribe({
      next: alerts => this.totalActiveAlerts = alerts.length,
      error: () => this.totalActiveAlerts = 0
    });
  }


  /*
   * Load patients directly from Spring Boot API via PatientService.
   * 
   * Calls: POST /api/auth/login → Backend → MongoDB → Dashboard Display
   *
   * Flow:
   * Spring Boot (/api/v1/patients/list/active)
   *      ↓
   * PatientService (with AuthInterceptor)
   *      ↓
   * PatientRepository
   *      ↓
   * MongoDB
   */
  loadPatients(): void {

    this.loading = true;
    this.errorMessage = '';

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.loading = false;
      this.errorMessage = 'User not authenticated. Please log in first.';
      console.warn('Cannot load patients: User not authenticated');
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    // Check if user has ADMIN role to view all patients
    if (currentUser?.role !== 'ADMIN') {
      this.loading = false;
      this.errorMessage = 'Only administrators can view all patient records.';
      console.warn('Cannot load patients: User is not an ADMIN');
      return;
    }

    // Call PatientService which uses AuthInterceptor for headers
    this.patientService.getAllActivePatients().subscribe({
      next: (data: any) => {
        // Handle different response formats
        if (Array.isArray(data)) {
          this.patients = data;
        } else if (Array.isArray(data?.data)) {
          this.patients = data.data;
        } else if (Array.isArray(data?.content)) {
          this.patients = data.content;
        } else {
          this.patients = [];
        }

        // Auto-select first patient for 360 view
        if (this.patients.length > 0) {
          this.selectedPatient = this.patients[0];
        }

        console.log(
          'Loaded', this.patients.length, 'patients from MongoDB via PatientService'
        );
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('PatientService error:', error);

        // Handle specific HTTP error codes
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'You do not have permission to view patient records.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to backend. Ensure Spring Boot is running on http://localhost:8080';
        } else {
          this.errorMessage = error.error?.error || 
            `Failed to load patients (HTTP ${error.status}). ${error.error?.message || 'Please try again.'}`;
        }
      }
    });

  }


  getPatientName(patient: Patient): string {

    const firstName = patient.firstName || '';
    const lastName = patient.lastName || '';

    const fullName =
      `${firstName} ${lastName}`.trim();

    return fullName || 'Unknown Patient';

  }


  getInitials(patient: Patient): string {

    const first =
      patient.firstName?.charAt(0) || '';

    const last =
      patient.lastName?.charAt(0) || '';

    return (
      first + last
    ).toUpperCase() || 'P';

  }


  calculateAge(dateOfBirth?: string): number | string {

    if (!dateOfBirth) {
      return '—';
    }

    const birthDate =
      new Date(dateOfBirth);

    if (isNaN(birthDate.getTime())) {
      return '—';
    }

    const today =
      new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const month =
      today.getMonth() -
      birthDate.getMonth();

    if (
      month < 0 ||
      (
        month === 0 &&
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }

    return age;

  }


  formatGender(gender?: string): string {

    if (!gender) {
      return '—';
    }

    return gender
      .toLowerCase()
      .replace(
        /^./,
        char => char.toUpperCase()
      );

  }


  viewPatient(patient: Patient): void {

    this.selectedPatient = patient;

    const patientId =
      patient.patientId ||
      patient.id;

    if (patientId) {

      /*
       * Redirect to Patient 360.
       *
       * This uses normal browser navigation so
       * it works even if Router configuration
       * still needs to be updated.
       */

      window.location.href =
        `/patient/${patientId}`;

    }

  }

}