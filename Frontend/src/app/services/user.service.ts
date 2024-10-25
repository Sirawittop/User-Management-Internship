import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface UserResponse {
    status: {
        code: string;
        description: string;
    };
    data: {
        items: User[];
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: Date;
    username: string;
    role?: {
        id: number;
        name: string;
    };
    permission?: {
        id: number;
        name: string;
    };
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    createdAt?: Date;
    username?: string;
    password?: string;
    roleId?: string;
    permission?: {
        permissionId?: string;
        isReadable: boolean;
        isWriteable: boolean;
        isDeletable: boolean;
    };
}



@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(private http: HttpClient) { }

    getUsers(
        pageNumber: number = 1,
        pageSize: number = 10,
        search?: string,
        orderBy?: string,
        orderDirection?: string
    ): Observable<UserResponse> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (search) {
            params = params.set('search', search);
        }
        if (orderBy) {
            params = params.set('orderBy', orderBy);
        }
        if (orderDirection) {
            params = params.set('orderDirection', orderDirection);
        }

        return this.http.post<UserResponse>(`${this.apiUrl}/users/DataTable`, {
            pageNumber,
            pageSize,
            search,
            orderBy,
            orderDirection
        });
    }

    getUserById(id: number): Observable<{ status: any; data: User }> {
        return this.http.get<{ status: any; data: User }>(`${this.apiUrl}/user/${id}`);
    }

    createUser(user: UpdateUserRequest): Observable<{ status: any; data: User }> {
        return this.http.post<{ status: any; data: User }>(`${this.apiUrl}/user`, user);
    }

    updateUser(id: number, user: UpdateUserRequest): Observable<{ status: any; data: User }> {
        return this.http.put<{ status: any; data: User }>(`${this.apiUrl}/user/${id}`, user);
    }

    deleteUser(id: number): Observable<{ status: any; data: { result: boolean; message: string } }> {
        return this.http.delete<{ status: any; data: { result: boolean; message: string } }>(`${this.apiUrl}/user/${id}`);
    }
}