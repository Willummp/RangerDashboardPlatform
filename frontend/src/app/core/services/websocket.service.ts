import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { Card } from '../../shared/models/card.model';
import { environment } from '../../../environments/environment';
export interface WebSocketMessage {
  event: 'card_updated' | 'card_created' | 'card_deleted';
  data: Card | { id: number };
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  constructor() { }
  public connect(dashboardId: number): Observable<WebSocketMessage> {
    const apiUrl = environment.apiUrl;
    const wsUrl = apiUrl.replace(/^http/, 'ws') + `/dashboards/ws/${dashboardId}`;

    console.log('Connecting to WebSocket:', wsUrl);

    this.socket$ = webSocket(wsUrl);
    return this.socket$.asObservable();
  }

  public disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
