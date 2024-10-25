import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MenuModule
    ],
    template: `
    <div class="sidebar">
      <div class="logo-section p-4">
        <h2 class="text-xl font-bold">YOURLOGO</h2>
      </div>

      <p-menu [model]="topMenuItems" styleClass="sidebar-menu w-full border-none"></p-menu>
      <div class="spacer"></div>
      <p-menu [model]="bottomMenuItems" styleClass="sidebar-menu w-full border-none"></p-menu>
    </div>
  `,
    styles: [`
    .sidebar {
      width: 225px;
      height: 100%;
      background-color: white;
      border-right: 1px solid #e5e7eb;
    }

    .logo-section {
      margin-left: 20px;
      padding-top: 20px;
      padding-bottom: 20px;
    }

    .spacer {
      height: 30px;
    }

    :host ::ng-deep .sidebar-menu {
      background: transparent;
      border: none;
      padding: 0;
      width: 100%;
\    }

    :host ::ng-deep .p-menu .p-menuitem-link {
      padding: 1rem 1.5rem;
      color: #6b7280;
      width: 225px;
      border-radius: 0;
      transition: all 0.2s;
    }

    :host ::ng-deep .p-menu .p-menuitem-link:hover {
      background-color: #f3f4f6;
      width: 225px;
    }

    :host ::ng-deep .p-menu .p-menuitem-link .p-menuitem-icon {
      margin-right: 0.75rem;
      color: #6b7280;
    }

    :host ::ng-deep .p-menu .p-menuitem-link.active {
      background-color: #eef2ff;
      color: #4f46e5 !important;
    }

    :host ::ng-deep .p-menu .p-menuitem-link.active .p-menuitem-icon {
      color: #4f46e5 !important;
    }

    :host ::ng-deep .p-menu .p-menuitem-link.active .p-menuitem-text {
      color: #4f46e5 !important;
    }
  `]
})
export class SidebarComponent {
    topMenuItems: MenuItem[] = [];
    bottomMenuItems: MenuItem[] = [];
    activeRoute: string = '';

    constructor(private router: Router) {
        // Subscribe to router events to update active state
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.updateActiveRoute();
        });
    }

    ngOnInit() {
        this.initializeMenuItems();
        this.updateActiveRoute();
    }

    private updateActiveRoute() {
        this.activeRoute = this.router.url;
        this.updateMenuItems();
    }

    private updateMenuItems() {
        // Update top menu items
        this.topMenuItems.forEach(item => {
            if (item.routerLink) {
                const isActive = this.activeRoute === item.routerLink[0];
                item.styleClass = isActive ? 'active' : '';
            }
        });

        // Update bottom menu items
        this.bottomMenuItems.forEach(item => {
            if (item.routerLink) {
                const isActive = this.activeRoute === item.routerLink[0];
                item.styleClass = isActive ? 'active' : '';
            }
        });
    }

    private initializeMenuItems() {
        this.topMenuItems = [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/dashboard'],
                command: () => this.updateActiveRoute()
            },
            {
                label: 'Users',
                icon: 'pi pi-fw pi-chart-bar',
                routerLink: ['/users'],
                command: () => this.updateActiveRoute()
            },
            {
                label: 'Documents',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/documents'],
                command: () => this.updateActiveRoute()
            },
            {
                label: 'Photos',
                icon: 'pi pi-fw pi-image',
                routerLink: ['/photos'],
                command: () => this.updateActiveRoute()
            },
            {
                label: 'Hierarchy',
                icon: 'pi pi-fw pi-gift',
                routerLink: ['/hierarchy'],
                command: () => this.updateActiveRoute()
            }
        ];

        this.bottomMenuItems = [
            {
                label: 'Message',
                icon: 'pi pi-fw pi-comments',
                routerLink: ['/message'],
                command: () => this.updateActiveRoute()
            },
            {
                label: 'Help',
                icon: 'pi pi-fw pi-question-circle',
                routerLink: ['/help'],
                command: () => this.updateActiveRoute()
            },
            {
                label: 'Setting',
                icon: 'pi pi-fw pi-cog',
                routerLink: ['/setting'],
                command: () => this.updateActiveRoute()
            }
        ];
    }
}