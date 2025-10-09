import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { Card } from '../../shared/models/card.model';

// Definindo a interface para as mensagens recebidas via WebSocket
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
    const wsUrl = `ws://127.0.0.1:8000/api/v1/dashboards/ws/${dashboardId}`;
    this.socket$ = webSocket(wsUrl);

    // Retorna um Observable para que outros serviços possam se inscrever
    return this.socket$.asObservable();
  }

  public disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
