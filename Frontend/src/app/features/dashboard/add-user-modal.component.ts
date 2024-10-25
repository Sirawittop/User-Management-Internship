import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../services/user.service';

interface UserData {
    [key: string]: string | null;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    roleType: string | null;
    username: string;
    password: string;
    confirmPassword: string;
}

interface ModulePermission {
    name: string;
    read: boolean;
    write: boolean;
    delete: boolean;
}

interface RoleType {
    label: string;
    value: string;
}


@Component({
    selector: 'app-add-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        InputTextModule,
        DropdownModule,
        CheckboxModule,
        ButtonModule,
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            [modal]="true"
            [style]="{ width: '1150px', height: '700px', 'margin-left': 'auto', 'margin-right': 'auto' }"
            [draggable]="false"
            [resizable]="false"
            [header]="isEditMode ? 'Edit User' : 'Add User'"
            [closable]="true"
            (onHide)="closeDialog()"
            styleClass="custom-dialog"
            position="center"
        >
            <div class="grid gap-4 p-4">
                <!-- First row -->
                <div class="flex gap-4 justify-center">
                    <div class="flex-1 max-w-3xl">
                        <input
                            pInputText
                            class="w-full"
                            style="width: 95%; margin: 35px 0 0 0; margin-left: 25px;"
                            [(ngModel)]="userData.userId"
                            placeholder="User ID *"
                            [disabled]="isEditMode"
                        />
                    </div>
                </div>

                <div class="flex gap-4 justify-center">
                    <div class="flex-1 max-w-3xl">
                        <input
                            pInputText
                            class="w-full"
                            style="width: 94.5%; margin: 17px 0 0 0;margin-left: 25px;"
                            [(ngModel)]="userData.firstName"
                            placeholder="First Name *"
                        />
                    </div>
                    <div class="flex-1 max-w-3xl">
                        <input
                            pInputText
                            class="w-full"
                            style="width: 94.5%; margin: 17px 0 0 0;"
                            [(ngModel)]="userData.lastName"
                            placeholder="Last Name *"
                        />
                    </div>
                </div>

                <div class="flex gap-4 justify-center">
                    <div class="flex-1 max-w-3xl">
                        <input
                            pInputText
                            class="w-full"
                            style="width: 91.5%; margin: 17px 0 0 0;margin-left: 25px;"
                            [(ngModel)]="userData.email"
                            placeholder="Email ID *"
                        />
                    </div>
                    <div class="flex-1 max-w-3xl">
                        <input
                            pInputText
                            class="w-full"
                            style="width: 91.5%; margin: 17px 0 0 0;"
                            [(ngModel)]="userData.mobile"
                            placeholder="Mobile No"
                        />
                    </div>
                    <div class="flex-1 max-w-3xl">
                        <p-dropdown
                            [options]="roleTypes"
                            [(ngModel)]="userData.roleType"
                            placeholder="Select a role"
                            [style]="{ width: '91.5%', marginTop: '17px' }"
                        ></p-dropdown>
                    </div>
                </div>

                <div class="flex gap-4 justify-center">
                    <div class="flex-1 max-w-3xl">
                        <input
                            pInputText
                            class="w-full"
                            style="width: 91.5%; margin: 17px 0 0 0;margin-left: 25px;"
                            [(ngModel)]="userData.username"
                            placeholder="Username *"
                        />
                    </div>
                    <div class="flex-1 max-w-3xl">
                        <input
                            pInputText
                            type="password"
                            class="w-full"
                            style="width: 91.5%; margin: 17px 0 0 0;"
                            [(ngModel)]="userData.password"
                            placeholder="{{ isEditMode ? 'New Password' : 'Password *' }}"
                        />
                    </div>
                    <div class="flex-1 max-w-3xl">
                        <input
                            pInputText
                            type="password"
                            class="w-full"
                            style="width: 91.5%; margin: 17px 0 0 0;"
                            [(ngModel)]="userData.confirmPassword"
                            placeholder="{{ isEditMode ? 'Confirm New Password' : 'Confirm Password *' }}"
                        />
                    </div>
                </div>

                <!-- Permissions section -->
                <div style="margin-top: 30px; background-color: white; font-size: 18px; padding: 20px; width: 1100px; border-radius: 16px; margin-left: 25px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f3f4f6;">
                                <th style="padding: 10px; text-align: left;">Module Permission</th>
                                <th style="padding: 10px; text-align: center;">Read</th>
                                <th style="padding: 10px; text-align: center;">Write</th>
                                <th style="padding: 10px; text-align: center;">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let module of modules">
                                <td style="padding: 10px;">{{ module.name }}</td>
                                <td style="text-align: center;">
                                    <p-checkbox [(ngModel)]="module.read" [binary]="true"></p-checkbox>
                                </td>
                                <td style="text-align: center;">
                                    <p-checkbox [(ngModel)]="module.write" [binary]="true"></p-checkbox>
                                </td>
                                <td style="text-align: center;">
                                    <p-checkbox [(ngModel)]="module.delete" [binary]="true"></p-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2 px-4 pb-4" style="justify-content: flex-end;margin-top:15px;margin-bottom:15px;">
                    <button
                        pButton
                        label="Cancel"
                        class="p-button-text"
                        (click)="closeDialog()"
                    ></button>
                    <button
                        pButton
                        [label]="isEditMode ? 'Update User' : 'Add User'"
                        class="p-button-primary"
                        style="background-color: #4A85F6;"
                        (click)="saveUser()"
                    ></button>
                </div>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        :host ::ng-deep .custom-dialog .p-dialog-header {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #dee2e6;
        }

        :host ::ng-deep .custom-dialog .p-dialog-content {
            padding: 0;
        }

        :host ::ng-deep .custom-dialog .p-dialog-footer {
            padding: 0;
            border-top: 1px solid #dee2e6;
        }

        :host ::ng-deep .p-checkbox .p-checkbox-box {
            border-radius: 4px;
        }

        :host ::ng-deep .p-inputtext {
            padding: 0.5rem 0.75rem;
        }

        :host ::ng-deep .p-dropdown {
            border-radius: 4px;
        }

        :host ::ng-deep .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
            padding: 0.75rem 1.25rem;
        }

        .flex {
            display: flex;
        }

        .flex-1 {
            flex: 1;
        }

        input {
            width: 100%;
        }

        label {
            margin-bottom: 0.25rem;
        }

        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
    `]
})
export class AddUserModalComponent {
    visible = false;
    isEditMode = false;
    editUserId?: number;

    userData: UserData = {
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        roleType: null,
        username: '',
        password: '',
        confirmPassword: '',
    };

    roleTypes: RoleType[] = [
        { label: 'Super Admin', value: '1' },  // Use your actual role IDs
        { label: 'Admin', value: '2' },
        { label: 'Employee', value: '3' }
    ];

    modules: ModulePermission[] = [
        { name: 'Super Admin', read: false, write: false, delete: false },
        { name: 'Admin', read: false, write: false, delete: false },
        { name: 'Employee', read: false, write: false, delete: false },
        { name: 'Lorem Ipsum', read: false, write: false, delete: false },
    ];

    constructor(private userService: UserService) { }

    openDialog(): void {
        this.isEditMode = false;
        this.editUserId = undefined;
        this.resetForm();
        this.visible = true;
    }


    private formatRoleType(roleType: string | null): string | null {
        return roleType ? roleType.toLowerCase().replace(/\s+/g, '_') : null;
    }

    private formatRoleTypeForDisplay(roleType: string | null): string | null {
        if (!roleType) return null;
        switch (roleType.toLowerCase()) {
            case 'super_admin':
                return 'Super Admin';
            case 'employee':
                return 'Employee';
            case 'admin':
                return 'Admin';
            default:
                // Return the roleType with the first character capitalized if not a special case
                return roleType.charAt(0).toUpperCase() + roleType.slice(1);
        }
    }


    openDialogEdit(user: User): void {
        this.isEditMode = true;
        this.editUserId = user.id;

        const roleId = user.role?.id?.toString() || null;

        this.userData = {
            userId: user.id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.phone || '',
            roleType: roleId,  // Use the numeric ID directly
            username: user.username || '',
            password: '',
            confirmPassword: '',
        };

        this.modules.forEach((module) => {
            module.read = false;
            module.write = false;
            module.delete = false;
        });

        if (user.permissions) {
            this.setPermissions(user.permissions);
        }

        this.visible = true;
    }




    private setPermissions(permissions: any): void {
        // Implement based on your permissions structure
        // Example:
        // permissions.forEach(permission => {
        //     const module = this.modules.find(m => m.name === permission.moduleName);
        //     if (module) {
        //         module.read = permission.read;
        //         module.write = permission.write;
        //         module.delete = permission.delete;
        //     }
        // });
    }

    closeDialog(): void {
        this.visible = false;
        this.resetForm();
        this.isEditMode = false;
        this.editUserId = undefined;
    }

    resetForm(): void {
        this.userData = {
            userId: '',
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            roleType: null,
            username: '',
            password: '',
            confirmPassword: '',
        };
        this.modules.forEach((module) => {
            module.read = false;
            module.write = false;
            module.delete = false;
        });
    }


    saveUser(): void {
        // Create a mutable array of required fields
        let requiredFields: string[] = [
            'userId',
            'firstName',
            'lastName',
            'email',
            'username'
        ];

        // Add password fields if not in edit mode
        if (!this.isEditMode) {
            requiredFields = [...requiredFields, 'password', 'confirmPassword'];
        }

        const missingFields = requiredFields.filter(
            (field) => !this.userData[field]
        );

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return;
        }

        // Only validate passwords if they're provided in edit mode or if it's a new user
        if ((!this.isEditMode || (this.userData.password && this.userData.confirmPassword))
            && this.userData.password !== this.userData.confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        const userDataToSubmit: UpdateUserRequest = {
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            email: this.userData.email,
            phone: this.userData.mobile,
            username: this.userData.username,
            ...(this.userData.password && { password: this.userData.password }),
            ...(this.userData.roleType && { roleId: this.userData.roleType }), // Send the role ID directly
            permission: {
                permissionId: '1',
                isReadable: this.modules.some(m => m.read),
                isWriteable: this.modules.some(m => m.write),
                isDeletable: this.modules.some(m => m.delete)
            }
        };


        if (this.isEditMode) {
            this.userService.updateUser(this.editUserId!, userDataToSubmit).subscribe({
                next: (response) => {
                    this.closeDialog();
                },
                error: (error) => {
                    console.error('Error updating user:', error);
                },
            });
        } else {
            this.userService.createUser(userDataToSubmit).subscribe({
                next: (response) => {
                    this.closeDialog();
                },
                error: (error) => {
                    console.error('Error creating user:', error);
                },
            });
        }
    }

}

// Required interfaces
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    username?: string;
    role?: {
        id: number;
        name: string;
    };
    permissions?: any;
    createdAt: Date;
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    username: string;
    password?: string;
    roleId?: string;
    permission?: {
        permissionId: string;
        isReadable: boolean;
        isWriteable: boolean;
        isDeletable: boolean;
    };
}