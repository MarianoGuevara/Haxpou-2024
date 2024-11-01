import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home.page').then((m) => m.HomePage),
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login.page').then((m) => m.LoginPage),
    },
    // {
    //     path: '',
    //     redirectTo: 'alta-cliente', //modificar esto
    //     pathMatch: 'full',
    // },
    {
        path: 'alta-cliente',
        loadComponent: () =>
            import('./pages/alta-cliente/alta-cliente.page').then(
                (m) => m.AltaDSPage
            ),
    },
    {
        path: 'clientes-pendientes',
        loadComponent: () =>
            import('./pages/clientes-pendientes/clientes-pendientes.page').then(
                (m) => m.ClientesPendientesPage
            ),
    },
];
