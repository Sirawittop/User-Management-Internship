import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

interface Document {
  id: number;
  title: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    ToastModule,
    DialogModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
      <!-- Documents Section -->
      <div>
      <h1 class="dashboard-title font-bold mb-6" style="margin-left: 10px; margin-top:-10px;">
      Documents
      </h1>
        <!-- Search and Controls -->
        <div class="flex justify-between items-center mb-6">
        <div class="p-input-icon-left" style="width: 850px; cursor: text;" (click)="inputElement.focus()">
            <i class="pi pi-search" style="width: 850px;"></i>
            <input
              #inputElement
              type="text"
              pInputText
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Search Documents"
              class="w-full"
              style="width: 850px; border-radius: 16px; font-size: 14px;"
            />
          </div>

          <p-dropdown
            placeholder="Sort by"
            [style]="{
              width: '150px',
              backgroundColor: '#F7F7F7',
              border: 'none',
              marginLeft: '10px',
              fontSize: '14px !important'
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

        <!-- Action Buttons -->
        <div class="flex gap-2 mb-6" style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
    <div class="flex-start">
        <button pButton icon="pi pi-file" class="p-button-text text-blue-500"></button>
        <button pButton icon="pi pi-window-maximize" class="p-button-text"></button>
        <button pButton icon="pi pi-print" class="p-button-text"></button>
        <button pButton icon="pi pi-trash" class="p-button-text"></button>
    </div>

    <div class="flex-end" style="display: flex; align-items: center;">
        <p-dropdown
            placeholder="This Month"
            [style]="{
              width: '200px',
              backgroundColor: '#F7F7F7',
              fontSize: '14px !important'
            }"
        ></p-dropdown>

        <p-dropdown
            placeholder="Documents"
            [style]="{
              width: '200px',
              backgroundColor: '#F7F7F7',
              fontSize: '14px !important'
            }"
        ></p-dropdown>

        <!-- ADD button + -->
        <button
            pButton
            class="p-button-primary"
            style="background-color: #4A85F6; width: 50px; margin-left: 20px;"
            icon="pi pi-plus"
            (click)="createDocument()"
        ></button>
    </div>
</div>


        <!-- Documents List -->
        <div class="card" style="margin-top: 20px;">
        <div class="p-4 border-bottom-1 surface-border">
            <h3 class="font-medium mb-2" style="margin-top: 20px; margin-left: 20px;">List of documents</h3>
            <p class="text-sm text-gray-500" style="margin-top: -20px; margin-left: 20px;">Lorem ipsum lorem uojuhn</p>
          </div>
          <p-table
      [value]="documents"
      [paginator]="true"
      [rows]="10"
      [showCurrentPageReport]="true"
      responsiveLayout="scroll"
      [rowHover]="true"
      styleClass="p-datatable-sm"
    >
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 80px"></th>
          <th></th>
          <th></th>
          <th style="width: 120px"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-document>
        <tr>
          <td style="text-align: center;">
            <span class="p-2 border-round bg-blue-50">
              <i class="pi pi-file text-blue-500"></i>
            </span>
          </td>
          <td>
            <div>
              <div class="font-medium">{{document.title}}</div>
              <div class="text-sm text-gray-500">{{document.date}}</div>
            </div>
          </td>
          <td>
            <div class="text-sm text-gray-700">{{document.description}}</div>
          </td>
          <td>
            <div class="flex justify-content-end">
              <button pButton icon="pi pi-pencil" class="p-button-text mr-2"></button>
              <button pButton icon="pi pi-trash" class="p-button-text"></button>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
        </div>
        
      </div>
    </div>

    <p-toast></p-toast>

    <!-- Create/Edit Document Dialog -->
    <p-dialog
      [(visible)]="documentDialog"
      [style]="{width: '450px'}"
      header="Document Details"
      [modal]="true"
      styleClass="p-fluid"
    >
      <ng-template pTemplate="content">
        <div class="field">
          <label for="title">Title</label>
          <input type="text" pInputText id="title" [(ngModel)]="document.title" required />
        </div>
        <div class="field">
          <label for="description">Description</label>
          <textarea
            id="description"
            pInputTextarea
            [(ngModel)]="document.description"
            rows="3"
          ></textarea>
        </div>
      </ng-template>

      <ng-template pTemplate="footer">
        <button pButton label="Cancel" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
        <button pButton label="Save" icon="pi pi-check" class="p-button-text" (click)="saveDocument()"></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
      .dashboard-title {
      font-size: 24px;
      color: #4a85f6;
    }


    :host ::ng-deep .p-dropdown {
      background: #f8f9fa;
    }

    :host ::ng-deep .p-button.p-button-text {
      color: #6c757d;
    }

    :host ::ng-deep .p-button.p-button-text:hover {
      background: #f8f9fa;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: #f8f9fa;
    }

    .card {
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 1px -1px rgba(0,0,0,0.2),
                  0 1px 1px 0 rgba(0,0,0,0.14),
                  0 1px 3px 0 rgba(0,0,0,0.12);
    }
  `]
})
export class DocumentsComponent implements OnInit {
  documents: Document[] = [];
  searchQuery: string = '';
  selectedTime: any = null;
  selectedType: any = null;
  documentDialog: boolean = false;
  document: Partial<Document> = {};

  timeOptions = [
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'This Year', value: 'this_year' }
  ];

  typeOptions = [
    { label: 'Documents', value: 'documents' },
    { label: 'Images', value: 'images' },
    { label: 'Videos', value: 'videos' }
  ];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    // Initialize with dummy data
    this.documents = [
      {
        id: 1,
        title: 'Lorem ipsum',
        date: 'April 9, 2022',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'
      },
      {
        id: 2,
        title: 'Lorem ipsum',
        date: 'April 9, 2022',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'
      },
      {
        id: 3,
        title: 'Lorem ipsum',
        date: 'April 9, 2022',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'
      }
    ];
  }

  onSearch() {
    // Implement search logic
    console.log('Searching:', this.searchQuery);
  }

  onTimeChange() {
    // Implement time filter logic
    console.log('Time changed:', this.selectedTime);
  }

  onTypeChange() {
    // Implement type filter logic
    console.log('Type changed:', this.selectedType);
  }

  createDocument() {
    this.document = {};
    this.documentDialog = true;
  }

  editDocument(doc: Document) {
    this.document = { ...doc };
    this.documentDialog = true;
  }

  deleteDocument(doc: Document) {
    // Implement delete logic
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Document deleted'
    });
  }

  hideDialog() {
    this.documentDialog = false;
  }

  saveDocument() {
    if (this.document.title?.trim()) {
      if (this.document.id) {
        // Update existing document
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Document updated'
        });
      } else {
        // Create new document
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Document created'
        });
      }
      this.documentDialog = false;
    }
  }
}