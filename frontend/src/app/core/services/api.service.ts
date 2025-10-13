import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Dashboard } from '../../shared/models/dashboard.model';
import { Card } from '../../shared/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDashboard(dashboardId: number): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboards/${dashboardId}`);
  }

  updateCard(cardId: number, changes: Partial<Card>): Observable<Card> {
    return this.http.patch<Card>(`${this.apiUrl}/dashboards/cards/${cardId}`, changes);
  }
}
