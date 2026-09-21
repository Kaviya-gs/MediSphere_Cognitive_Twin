import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="app-container">
      <app-navbar></app-navbar>
      <div class="app-content">
        <app-sidebar></app-sidebar>
        <main id="main-content" class="main-content" tabindex="-1">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .app-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background-color: #f5f8fb;
    }
    .skip-link {
      position: fixed;
      left: 1rem;
      top: -4rem;
      z-index: 2000;
      padding: .75rem 1rem;
      color: #fff;
      background: #1769b7;
    }
    .skip-link:focus { top: 1rem; }
  `]
})
export class AppComponent {
  title = 'MediSphere Cognitive Twin';
}
