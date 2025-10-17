# User Management & User Access API Project for Interview Internship

![.NET](https://img.shields.io/badge/.NET-7-blue) ![EF Core](https://img.shields.io/badge/EntityFrameworkCore-lightgrey) ![Angular](https://img.shields.io/badge/Angular-red) ![CORS](https://img.shields.io/badge/CORS-enabled-green)  

---

## 🔹 Project Overview

This project is a **user management system** with role-based access and permissions.  
It provides a **backend API** built with ASP.NET Core Minimal API and Entity Framework Core, and a **frontend Angular application** for interacting with users, roles, and permissions.  

**Key features:**  
- User CRUD operations (Create, Read, Update, Delete)  
- Role and permission management  
- Pagination, sorting, and searching for users  
- Password hashing using **BCrypt**  
- Swagger documentation for API endpoints  
- CORS configuration for Angular frontend integration  

---

## 📦 Backend Technology Stack

- **ASP.NET Core Minimal API**  
- **Entity Framework Core (SQL Server)**  
- **BCrypt.Net** for password hashing  
- **Swagger/OpenAPI** for API documentation  
- JSON serialization with cycle handling and null ignoring  
- Exception handling with structured JSON responses  

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/{id}` | GET | Get user by ID |
| `/api/user` | POST | Create new user |
| `/api/users/DataTable` | POST | List users with pagination and search |
| `/api/user/{id}` | PUT | Update user by ID |
| `/api/user/{id}` | DELETE | Delete user by ID |
| `/api/roles` | GET | Get all roles |
| `/api/permissions` | GET | Get all permissions |

---

## ⚡ Frontend Technology Stack

- **Angular 17+**  
- **TypeScript** and **HTML/CSS**  
- Components include:  
  - Header & Sidebar  
  - Dashboard  
  - Add User Modal  
  - Documents Management  
- Services for API interaction and state management  

