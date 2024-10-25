import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        title: 'Dashboard'
    },
    // {
    //     path: 'users',
    //     loadComponent: () => import('./features/users/users.component')
    //         .then(m => m.UsersComponent),
    //     title: 'Users'
    // },
    {
        path: 'documents',
        loadComponent: () => import('./features/documents/documents.component')
            .then(m => m.DocumentsComponent),
        title: 'Documents'
    },
    // {
    //     path: 'photos',
    //     loadComponent: () => import('./features/photos/photos.component')
    //         .then(m => m.PhotosComponent),
    //     title: 'Photos'
    // },
    // {
    //     path: 'hierarchy',
    //     loadComponent: () => import('./features/hierarchy/hierarchy.component')
    //         .then(m => m.HierarchyComponent),
    //     title: 'Hierarchy'
    // },
    // {
    //     path: 'message',
    //     loadComponent: () => import('./features/message/message.component')
    //         .then(m => m.MessageComponent),
    //     title: 'Message'
    // },
    // {
    //     path: 'help',
    //     loadComponent: () => import('./features/help/help.component')
    //         .then(m => m.HelpComponent),
    //     title: 'Help'
    // },
    // {
    //     path: 'setting',
    //     loadComponent: () => import('./features/settings/settings.component')
    //         .then(m => m.SettingsComponent),
    //     title: 'Settings'
    // },
    // {
    //     path: '**',
    //     loadComponent: () => import('./features/not-found/not-found.component')
    //         .then(m => m.NotFoundComponent),
    //     title: '404 Not Found'
    // }
];