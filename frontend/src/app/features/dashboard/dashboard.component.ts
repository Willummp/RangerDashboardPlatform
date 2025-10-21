import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { GridsterConfig, GridsterItem, GridsterModule } from 'angular-gridster2';

import { ApiService } from '../../core/services/api.service';
import { WebsocketService, WebSocketMessage } from '../../core/services/websocket.service';
import { Dashboard } from '../../shared/models/dashboard.model';
import { Card } from '../../shared/models/card.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GridsterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  public dashboard: Dashboard | null = null;
  public gridItems: GridsterItem[] = [];
  public gridOptions!: GridsterConfig;

  private destroy$ = new Subject<void>();
  private dashboardId = 1;

  constructor(
    private apiService: ApiService,
    private websocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupGridOptions();
    this.loadDashboard();
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.websocketService.disconnect();
  }

  private setupGridOptions(): void {
    this.gridOptions = {
      gridType: 'fit',
      // Cada linha terá uma altura de 200px
      fixedRowHeight: 200,
      // --- CONFIGURAÇÃO DO GRID 2x6 ---
      minCols: 6,
      maxCols: 12,
      minRows: 2,
      maxRows: 3,
      // --- FIM DA CONFIGURAÇÃO ---
      draggable: { enabled: true },
      resizable: { enabled: true },
      displayGrid: 'onDrag&Resize',
      // Callback para salvar a posição quando um card é movido/redimensionado
      itemChangeCallback: (item: GridsterItem) => {
        console.log('ITEM MUDOU! ID:', item['id'], 'Nova Posição:', {x: item.x, y: item.y, cols: item.cols, rows: item.rows});

        const cardId = item['id'];
        if (!cardId) return;

        this.apiService.updateCard(cardId, {
          position_x: item.x,
          position_y: item.y,
          width: item.cols,
          height: item.rows
        }).subscribe();
      },
    };
  }

  private loadDashboard(): void {
    this.apiService.getDashboard(this.dashboardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(dashboardData => {
        this.dashboard = dashboardData;
        this.gridItems = this.mapCardsToGridItems(dashboardData.cards);
      });
  }

  private connectWebSocket(): void {
    this.websocketService.connect(this.dashboardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: WebSocketMessage) => {
        switch (message.event) {
          case 'card_updated':
            this.handleCardUpdate(message.data as Card);
            break;
          // Lógica para novos eventos (card_created, etc.) pode ser adicionada aqui
        }
      });
  }

  private handleCardUpdate(updatedCard: Card): void {
    const itemToUpdate = this.gridItems.find(item => item['id'] === updatedCard.id);

    if (itemToUpdate && (
        itemToUpdate.x !== updatedCard.position_x ||
        itemToUpdate.y !== updatedCard.position_y ||
        itemToUpdate.cols !== updatedCard.width ||
        itemToUpdate.rows !== updatedCard.height
    )) {
        console.log(`WebSocket: Recebida atualização para o card ${updatedCard.id}. Atualizando a tela.`);

        itemToUpdate.x = updatedCard.position_x;
        itemToUpdate.y = updatedCard.position_y;
        itemToUpdate.cols = updatedCard.width;
        itemToUpdate.rows = updatedCard.height;

        // Força a biblioteca Gridster a redesenhar a UI
        if (this.gridOptions.api?.optionsChanged) {
          this.gridOptions.api.optionsChanged();
        }
    }
  }

  private mapCardsToGridItems(cards: Card[]): GridsterItem[] {
    return cards.map(card => ({
      id: card.id, // Armazena o ID original do card
      x: card.position_x,
      y: card.position_y,
      cols: card.width,
      rows: card.height,
      title: card.title,
      chartType: card.chart_type
    }));
  }
}

