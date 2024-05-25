import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExternableComponent } from './pages/externable/externable.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => HomeComponent
    },
    {
        path: 'externable',
        loadComponent: () => ExternableComponent
    },
];
