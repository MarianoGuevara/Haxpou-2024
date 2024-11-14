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
    {
        path: 'alta-cliente',
        loadComponent: () =>
            import('./pages/alta-cliente/alta-cliente.page').then(
                (m) => m.AltaClientePage
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
        path: 'listado-productos',
        loadComponent: () =>
            import('./pages/listado-productos/listado-productos.page').then(
                (m) => m.ListadoProductosPage
            ),
    },
    {
        path: 'encuestas-previas',
        loadComponent: () =>
            import('./pages/encuestas-previas/encuestas-previas.page').then(
                (m) => m.EncuestasPreviasPage
            ),
    },
    {
        path: 'realizar-pedido',
        loadComponent: () =>
            import('./pages/realizar-pedido/realizar-pedido.page').then(
                (m) => m.RealizarPedidoPage
            ),
    },
    {
        path: 'chat-mozo/:numeroMesa',
        loadComponent: () =>
            import('./pages/chat-mozo/chat-mozo.page').then(
                (m) => m.ChatMozoPage
            ),
    },
    {
        path: 'botones-chat-mesas',
        loadComponent: () =>
            import('./pages/botones-chat-mesas/botones-chat-mesas.page').then(
                (m) => m.BotonesChatMesasPage
            ),
    },
    {
        path: 'listado-pedidos',
        loadComponent: () =>
            import('./pages/listado-pedidos/listado-pedidos.page').then(
                (m) => m.ListadoPedidosPage
            ),
    },
    {
        path: 'listado-pedidos-sector',
        loadComponent: () =>
            import(
                './pages/listado-pedidos-sector/listado-pedidos-sector.page'
            ).then((m) => m.ListadoPedidosSectorPage),
    },

    {
        path: 'cliente-estado-pedido-encuesta',
        loadComponent: () =>
            import(
                './pages/cliente-estado-pedido-encuesta/cliente-estado-pedido-encuesta.page'
            ).then((m) => m.ClienteEstadoPedidoEncuestaPage),
    },
    {
        path: 'encuesta-alta',
        loadComponent: () =>
            import('./pages/encuesta-alta/encuesta-alta.page').then(
                (m) => m.EncuestaAltaPage
            ),
    },
    {
        path: 'detalle-cuenta',
        loadComponent: () =>
            import('./pages/detalle-cuenta/detalle-cuenta.page').then(
                (m) => m.DetalleCuentaPage
            ),
    },  {
    path: 'cuenta-pedida',
    loadComponent: () => import('./pages/cuenta-pedida/cuenta-pedida.page').then( m => m.CuentaPedidaPage)
  },
  {
    path: 'propina',
    loadComponent: () => import('./pages/propina/propina.page').then( m => m.PropinaPage)
  },

];
