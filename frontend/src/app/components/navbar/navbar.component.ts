import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="top-header">
      <a class="brand" routerLink="/dashboard" aria-label="MediSphere overview">
        <span class="brand-mark"><i class="fas fa-heart-pulse" aria-hidden="true"></i></span>
        <span><strong>MediSphere</strong><small>Cognitive Twin · Patient 360</small></span>
      </a>
      <label class="global-search">
        <span class="visually-hidden">Search patients, MRN, or records</span>
        <i class="fas fa-search" aria-hidden="true"></i>
        <input type="search" placeholder="Search patients, MRN, or records" />
        <kbd>Ctrl K</kbd>
      </label>
      <div class="header-actions">
        <button class="icon-button" type="button" aria-label="Notifications"><i class="fas fa-bell" aria-hidden="true"></i><span class="notification-dot"></span></button>
        <span class="user-profile"><span class="avatar">AD</span><span><strong>admin</strong><small>Administrator</small></span></span>
        <button class="logout-button" type="button" routerLink="/login"><i class="fas fa-arrow-right-from-bracket" aria-hidden="true"></i> Logout</button>
      </div>
    </header>
  `,
  styles: [`
    .top-header { min-height: 74px; display: flex; align-items: center; gap: 28px; padding: 0 28px; background: #fff; border-bottom: 1px solid #dfe7ef; box-shadow: 0 2px 10px rgba(25, 60, 90, .04); }
    .brand { display: flex; align-items: center; gap: 11px; min-width: 245px; color: #1f3347; text-decoration: none; }
    .brand-mark { display: grid; place-items: center; width: 38px; height: 38px; color: #fff; background: #159bb3; border-radius: 9px; font-size: 1.1rem; }
    .brand strong, .brand small, .user-profile strong, .user-profile small { display: block; }
    .brand strong { font-size: 1.15rem; letter-spacing: -.02em; }
    .brand small { margin-top: 2px; color: #8190a0; font-size: .68rem; }
    .global-search { display: flex; align-items: center; gap: 9px; flex: 1; max-width: 560px; margin: 0 auto; padding: 9px 12px; color: #7d8c9a; background: #f7f9fb; border: 1px solid #dfe7ef; border-radius: 7px; }
    .global-search input { width: 100%; border: 0; outline: 0; background: transparent; color: #25384a; font: inherit; font-size: .82rem; }
    kbd { padding: 3px 6px; color: #7b8997; background: #fff; border: 1px solid #dbe4ec; border-radius: 4px; font-size: .65rem; white-space: nowrap; }
    .header-actions { display: flex; align-items: center; gap: 18px; margin-left: auto; }
    .icon-button, .logout-button { border: 0; background: transparent; color: #546678; cursor: pointer; }
    .icon-button { position: relative; font-size: 1rem; }
    .notification-dot { position: absolute; top: -3px; right: -4px; width: 6px; height: 6px; background: #df5d63; border: 2px solid #fff; border-radius: 50%; }
    .user-profile { display: flex; align-items: center; gap: 8px; color: #25384a; font-size: .76rem; }
    .user-profile small { color: #8a98a6; font-size: .64rem; }
    .avatar { display: grid; place-items: center; width: 32px; height: 32px; color: #fff; background: #267db8; border-radius: 50%; font-size: .68rem; font-weight: 700; }
    .logout-button { padding: 7px 10px; border: 1px solid #d8e2eb; border-radius: 5px; font-size: .75rem; }
    .logout-button:hover, .icon-button:hover { color: #147e96; }
    @media (max-width: 900px) { .top-header { gap: 14px; padding: 0 16px; } .brand { min-width: auto; } .brand small, .global-search kbd, .user-profile span:not(.avatar) { display: none; } }
    @media (max-width: 620px) { .global-search { display: none; } .top-header { justify-content: space-between; } }
  `]
})
export class NavbarComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
