import { Routes } from '@angular/router';

export const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'login',
    //     pathMatch: 'full',
    // },
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
    {
        path: '',
        redirectTo: 'alta-ds', //modificar esto
        pathMatch: 'full',
    },
    {
        path: 'alta-ds',
        loadComponent: () =>
            import('./pages/alta-ds/alta-ds.page').then((m) => m.AltaDSPage),
    },
    {
        path: 'clientes-pendientes',
        loadComponent: () => import('./pages/clientes-pendientes/clientes-pendientes.page').then( m => m.ClientesPendientesPage)
    },

];
