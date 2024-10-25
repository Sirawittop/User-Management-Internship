import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { User, UserResponse, UserService } from '../../services/user.service';
import { AddUserModalComponent } from './add-user-modal.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        AvatarModule,
        TagModule,
        ToastModule,
        DialogModule,
        AddUserModalComponent
    ],
    providers: [MessageService],
    template: `
    <div class="p-4 min-h-screen">
      <p-toast></p-toast>
      <app-add-user #addUserModal></app-add-user>
      
      <h1 class="dashboard-title font-bold mb-6" style="margin-left: 10px; margin-top:-10px;">
        Users Dashboard
      </h1>

      <div class="flex justify-between items-center mb-6">
        <div class="flex-1 mr-4">
          <div class="p-input-icon-left" style="width: 550px; cursor: text;" (click)="inputElement.focus()">
            <i class="pi pi-search" style="width: 550px;"></i>
            <input
              #inputElement
              type="text"
              pInputText
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Search"
              class="w-full"
              style="width: 550px; border-radius: 16px; font-size: 14px;"
            />
          </div>
          <button
            pButton
            label="Add user"
            class="p-button-primary"
            style="background-color: #4A85F6; width: 140px; margin-left: 20px;"
            icon="pi pi-plus"
            (click)="createUser()"
          ></button>

          <p-dropdown
            [options]="sortOptions"
            [(ngModel)]="selectedSort"
            (onChange)="onSortChange()"
            placeholder="Sort by"
            [style]="{
              width: '150px',
              backgroundColor: '#F7F7F7',
              border: 'none',
              marginLeft: '10px',
              fontSize: '14px !important'
            }"
          ></p-dropdown>

          <p-dropdown
            [options]="savedSearches"
            [(ngModel)]="selectedSearch"
            placeholder="Saved search"
            [style]="{
              width: '170px',
              backgroundColor: '#F7F7F7',
              border: 'none',
              marginLeft: '10px',
            }"        
          ></p-dropdown>

          <button
            pButton
            icon="pi pi-sliders-h"
            class="p-button-outlined"
            [style]="{
              border: 'none',
              marginLeft: '10px',
              color: '#6b7280',
              backgroundColor: '#F7F7F7',
            }"    
          ></button>
        </div>

        <div style="margin-top: 30px; background-color: white; font-size: 18px; padding: 20px; width: 1100px; border-radius: 16px;">
          <div style="margin-bottom: 15px;">List Users</div>
          <p-table
            [value]="users"
            [paginator]="true"
            [rows]="pageSize"
            [totalRecords]="totalRecords"
            (onPage)="onPageChange($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            [rowsPerPageOptions]="[5, 10, 20, 30]"
            styleClass="p-datatable-sm"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Name</th>
                <th></th>
                <th>Create Date</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-user>
              <tr>
                <td style="height: 65px; width: 50px">
                  <div class="flex flex-col" style="margin-left: 20px;">
                    <span class="font-semibold" style="font-size: 16px;">
                      {{user.firstName}} {{user.lastName}}
                    </span>
                    <span class="text-gray-500 text-sm" style="font-size: 13px; color:#8F9BB3;">
                      {{user.email}}
                    </span>
                  </div>
                </td>
                <td style="text-align: center;">
                  <p-tag [value]="user.role?.name || 'No Role'"></p-tag>
                </td>
                <td>{{user.createdAt | date:'dd MMM, yyyy'}}</td>
                <td style="text-align: left;">
                  {{user.role?.name || 'No Role'}}
                </td>
                <td>
                  <div class="flex gap-4">
                    <button
                      pButton
                      icon="pi pi-pencil"
                      class="p-button-text p-button-sm"
                      (click)="editUser(user)"
                    ></button>
                    <button
                      pButton
                      icon="pi pi-trash"
                      class="p-button-text p-button-sm p-button-danger"
                      (click)="deleteUser(user.id)"
                    ></button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8f9fa;
      color: #6c757d;
      font-weight: 600;
      padding: 1rem;
    }

    :host ::ng-deep .p-tag {
      min-width: 80px;
      text-align: center;
    }

    .dashboard-title {
      font-size: 24px;
      color: #4a85f6;
    }

    :host ::ng-deep .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
      padding: 0.75rem 1.25rem;
      margin: 0;
      border: 0 none;
      color: #495057;
      background: transparent;
      transition: box-shadow 0.2s;
      border-radius: 0;
    }

    :host ::ng-deep .p-button.p-button-outlined {
      background-color: transparent;
      border: 1px solid #ced4da;
      color: #6c757d;
    }
  `]
})
export class DashboardComponent implements OnInit {
    @ViewChild('addUserModal') addUserModal!: AddUserModalComponent;

    users: User[] = [];
    loading = false;
    totalRecords = 0;
    pageSize = 10;
    currentPage = 1;
    searchQuery = '';
    selectedSort = '';
    selectedSearch = '';

    sortOptions = [
        { label: 'Name A-Z', value: 'FirstName_asc' },
        { label: 'Name Z-A', value: 'FirstName_desc' },
        { label: 'Email A-Z', value: 'Email_asc' },
        { label: 'Email Z-A', value: 'Email_desc' }
    ];

    savedSearches = [
        { label: 'All Users', value: 'all' },
        { label: 'Admins', value: 'admins' },
        { label: 'Editors', value: 'editors' },
        { label: 'Viewers', value: 'viewers' }
    ];

    constructor(
        private userService: UserService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        const [orderBy, orderDirection] = this.selectedSort ? this.selectedSort.split('_') : ['', ''];

        this.userService
            .getUsers(this.currentPage, this.pageSize, this.searchQuery, orderBy, orderDirection)
            .subscribe({
                next: (response: UserResponse) => {
                    this.users = response.data.items;
                    this.totalRecords = response.data.totalRecords;
                    this.loading = false;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load users'
                    });
                    this.loading = false;
                }
            });
    }

    onPageChange(event: any) {
        this.currentPage = event.page + 1;
        this.pageSize = event.rows;
        this.loadUsers();
    }

    onSearch() {
        this.currentPage = 1;
        this.loadUsers();
    }

    onSortChange() {
        this.loadUsers();
    }

    createUser() {
        this.addUserModal.openDialog();
    }

    editUser(user: User) {
        this.addUserModal.openDialogEdit(user);
    }

    deleteUser(id: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.userService.deleteUser(id).subscribe({
                next: (response) => {
                    if (response.data.result) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: response.data.message
                        });
                        this.loadUsers();
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete user'
                    });
                }
            });
        }
    }
}