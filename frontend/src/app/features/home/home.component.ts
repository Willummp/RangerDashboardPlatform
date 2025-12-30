import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Dashboard } from '../../shared/models/dashboard.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    dashboards: Dashboard[] = [];
    isLoading = true;

    constructor(
        private apiService: ApiService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadDashboards();
    }

    loadDashboards(): void {
        this.apiService.getDashboards().subscribe({
            next: (data) => {
                this.dashboards = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load dashboards', err);
                this.isLoading = false;
            }
        });
    }

    navigateToDashboard(id: number): void {
        this.router.navigate(['/dashboard', id]);
    }
}
