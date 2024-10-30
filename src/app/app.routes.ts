import { Routes } from '@angular/router';

export const routes: Routes = [
  {
      path: 'home',
      loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
      path: '',
      redirectTo: 'alta-ds', //modificar esto
      pathMatch: 'full',
  },
  {
    path: 'alta-ds',
    loadComponent: () => import('./pages/alta-ds/alta-ds.page').then( m => m.AltaDSPage)
  },

];
