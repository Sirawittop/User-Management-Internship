import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-header',
    template: `
    <div class="header-wrapper" style="margin-top: -25px;">
      <div class="header-container">
        <!-- Left section -->
        <div class="mb-8">
          <h2
            class="text-2xl"
            style="margin-bottom: -15px; font-size: 18px; font-weight: 500px; margin-left: -20px;"
          >
            Hello, Lekan
          </h2>
          <p class="text-gray-500" style="margin-bottom: 25px; margin-left: -20px;">
            Have a nice day
          </p>
        </div>

        <!-- Right section -->
        <div class="right-section">
          <button class="icon-button">
            <i class="pi pi-bell"></i>
          </button>
          <div class="user-section">
            <p-avatar styleClass="user-avatar" shape="circle" 
            [style]="{ width: '45px', height: '45px' }">
            
            </p-avatar>

            <div class="user-info">
              <span class="user-name">Lekan Okeowo</span>
              <span class="user-role">Admin</span>
            </div>
            <i class="pi pi-chevron-down dropdown-icon"></i>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [
        `
      .header-wrapper {
        width: 100%;
        background-color: #f7f7f7;
        padding: 1rem 2rem;
        border-bottom: 1px solid #f0f0f0;
      }

      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1400px;
        margin: 0 auto;
      }

      .left-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .logo {
        width: 24px;
        height: 24px;
      }

      .company-name {
        font-size: 1.25rem;
        color: #4169e1;
        font-weight: 500;
      }

      .nav-section {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .nav-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        background: transparent;
        color: #666;
        font-size: 0.9rem;
        cursor: pointer;
        border-radius: 0.5rem;
      }

      .nav-button.active {
        background: #f5f5f5;
        color: #333;
      }

      .nav-button-with-dropdown {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        background: transparent;
        color: #666;
        font-size: 0.9rem;
        cursor: pointer;
      }

      .nav-button i,
      .nav-button-with-dropdown i {
        font-size: 1rem;
      }

      .right-section {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .icon-button {
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-button i {
        font-size: 1.25rem;
      }

      .user-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
      }

      .user-info {
        display: flex;
        flex-direction: column;
      }

      .user-name {
        font-size: 0.9rem;
        color: #333;
        font-weight: 500;
      }

      .user-role {
        font-size: 0.8rem;
        color: #666;
      }

      .dropdown-icon {
        color: #666;
        font-size: 0.8rem;
      }
    `,
    ],
    standalone: true,
    imports: [CommonModule, RouterLink, MenuModule, ButtonModule, AvatarModule],
})
export class HeaderComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
