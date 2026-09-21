import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" aria-label="Primary navigation">
      <nav class="nav flex-column">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
          <i class="fas fa-chart-pie" aria-hidden="true"></i> Overview
        </a>
        <a routerLink="/patients" routerLinkActive="active" class="nav-link">
          <i class="fas fa-user-group" aria-hidden="true"></i> Patient 360
        </a>
        <a routerLink="/vitals" routerLinkActive="active" class="nav-link">
          <i class="fas fa-wave-square" aria-hidden="true"></i> Vitals Stream
        </a>
        <a routerLink="/lab-results" routerLinkActive="active" class="nav-link">
          <i class="fas fa-flask" aria-hidden="true"></i> Lab Results
        </a>
        <a routerLink="/fhir-resources" routerLinkActive="active" class="nav-link">
          <i class="fas fa-database" aria-hidden="true"></i> FHIR Resources
        </a>
        <hr class="my-2">
        <h6 class="sidebar-heading px-3 mt-4 mb-1">CLINICAL WORKSPACE</h6>
        <a routerLink="/consent" routerLinkActive="active" class="nav-link">
          <i class="fas fa-file-contract" aria-hidden="true"></i> Consent
        </a>
        <a routerLink="/predictions" routerLinkActive="active" class="nav-link">
          <i class="fas fa-chart-line" aria-hidden="true"></i> Predictions
        </a>
        <a routerLink="/care-plan" routerLinkActive="active" class="nav-link">
          <i class="fas fa-clipboard-list" aria-hidden="true"></i> Care Plans
        </a>
        <a routerLink="/audit" routerLinkActive="active" class="nav-link">
          <i class="fas fa-shield-halved" aria-hidden="true"></i> Audit Activity
        </a>
        <a routerLink="/model-management" routerLinkActive="active" class="nav-link">
          <i class="fas fa-microchip" aria-hidden="true"></i> Model Management
        </a>
        <a routerLink="/federated-learning" routerLinkActive="active" class="nav-link">
          <i class="fas fa-network-wired" aria-hidden="true"></i> Federated Learning
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 238px;
      flex: 0 0 238px;
      background-color: #fff;
      border-right: 1px solid #dfe7ef;
      overflow-y: auto;
      padding: 18px 0;
    }
    .nav-link {
      color: #5d6f80;
      padding: 0.75rem 1rem;
      text-decoration: none;
      display: block;
      transition: background-color .18s ease, color .18s ease;
    }
    .nav-link:hover {
      background-color: #eff8fa;
      color: #127c91;
    }
    .nav-link.active { background: #e6f5f7; color: #087d91; border-left: 3px solid #13a0b2; padding-left: 13px; font-weight: 700; }
    .nav-link i {
      margin-right: 10px;
      width: 20px;
    }
    .sidebar-heading {
      font-size: 0.875rem;
      font-weight: 700;
      color: #93a1ad;
      letter-spacing: .12em;
      font-size: .65rem;
    }
  `]
})
export class SidebarComponent {
}
