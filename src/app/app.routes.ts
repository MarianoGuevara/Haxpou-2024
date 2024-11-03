import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
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
    {
        path: 'espera-clientes-maitre',
        loadComponent: () =>
            import('./pages/maitre-lista-espera/maitre-lista-espera.page').then(
                (m) => m.MaitreListaEsperaPage
            ),
    },
    {
        path: 'espera-cliente',
        loadComponent: () =>
            import('./pages/espera-cliente/espera-cliente.page').then(
                (m) => m.EsperaClientePage
            ),
    },
    {
        path: 'alta-producto',
        loadComponent: () =>
            import('./pages/alta-producto/alta-producto.page').then(
                (m) => m.AltaProductoPage
            ),
    },
    {
        path: 'listado-productos',
        loadComponent: () =>
            import('./pages/listado-productos/listado-productos.page').then(
                (m) => m.ListadoProductosPage
            ),
    },
	{
		path: 'encuestas-previas',
		loadComponent: () => import('./pages/encuestas-previas/encuestas-previas.page').then( m => m.EncuestasPreviasPage)
	},

];
