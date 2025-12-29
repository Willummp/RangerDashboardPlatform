import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'dashboard/:id', component: DashboardComponent },
    { path: 'dashboard', redirectTo: '/dashboard/1', pathMatch: 'full' },
    { path: '', redirectTo: '/dashboard/1', pathMatch: 'full' }
];
