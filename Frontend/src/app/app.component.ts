import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  template: `
    <div class="flex h-screen">
      <app-sidebar></app-sidebar>
      <main class="flex-1 p-4 overflow-auto">
        <app-header></app-header>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .flex {
      display: flex;
    }

    app-sidebar {
      width: 250px; /* Set the width of the sidebar */
      min-width: 250px; /* Minimum width to prevent shrinking */
      background-color: #F7F7F7;
      /* Add additional sidebar styles here */
    }

    main {
      flex: 1;
      padding: 20px; /* Add padding to the main content area */
      background-color: #F7F7F7;
    }
  `]
})
export class AppComponent { }
