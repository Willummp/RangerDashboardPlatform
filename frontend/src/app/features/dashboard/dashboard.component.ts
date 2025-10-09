import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { GridsterConfig, GridsterModule } from 'angular-gridster2';
import { ApiService } from '../../core/services/api.service';
import { Dashboard } from '../../shared/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GridsterModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public dashboard$!: Observable<Dashboard>;
  public gridOptions!: GridsterConfig;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.dashboard$ = this.apiService.getDashboard(1);

    this.gridOptions = {
      gridType: 'fit',
      fixedRowHeight: 60,
      minCols: 16,
      maxCols: 16,
      minRows: 4,
      maxRows: 4,
      draggable: { enabled: true },
      resizable: { enabled: true },
      displayGrid: 'onDrag&Resize',
      mobileBreakpoint: 640,
    };
  }
}

