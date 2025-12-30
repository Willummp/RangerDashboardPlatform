import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GridsterConfig, GridsterItem, GridsterModule } from 'angular-gridster2';

import { ApiService } from '../../core/services/api.service';
import { WebsocketService, WebSocketMessage } from '../../core/services/websocket.service';
import { Dashboard } from '../../shared/models/dashboard.model';
import { Card } from '../../shared/models/card.model';
import { CHART_CONFIG } from '../../shared/config/chart.config';
import { ChartType } from '../../shared/enums/chart-type.enum';

import { ChartRendererComponent } from '../../shared/components/chart-renderer/chart-renderer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GridsterModule, ChartRendererComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  public dashboard: Dashboard | null = null;
  public gridItems: GridsterItem[] = [];
  public gridOptions!: GridsterConfig;
  public chartConfig = CHART_CONFIG;
  public ChartType = ChartType;

  private destroy$ = new Subject<void>();
  private dashboardId = 1;

  constructor(
    private apiService: ApiService,
    private websocketService: WebsocketService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.setupGridOptions();

    // Listen for route changes
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idParam = params.get('id');
      this.dashboardId = idParam ? parseInt(idParam, 10) : 1;

      // Reload everything when ID changes
      this.loadDashboard();
      // Reconnect WebSocket for new ID
      this.websocketService.disconnect();
      this.connectWebSocket();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.websocketService.disconnect();
  }

  private setupGridOptions(): void {
    this.gridOptions = {
      gridType: 'fit',
      fixedRowHeight: 60,
      minCols: 16,
      maxCols: 16,
      minRows: 3,
      maxRows: 100,
      margin: 10,
      outerMargin: true,
      draggable: { enabled: true },
      resizable: { enabled: true },
      displayGrid: 'onDrag&Resize',
      itemChangeCallback: (item: GridsterItem) => {
        console.log('ITEM MUDOU (Ação do usuário)! ID:', item['id'], 'Nova Posição:', { x: item.x, y: item.y });

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
          case 'card_created':
            this.handleCardCreated(message.data as Card);
            break;
          case 'card_updated':
            this.handleCardUpdate(message.data as Card);
            break;
          case 'card_deleted':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.handleCardDeleted(message.data as any);
            break;
        }
      });
  }

  private handleCardCreated(newCard: Card): void {
    console.log('WebSocket: Card Created', newCard);
    const newItem = this.mapCardsToGridItems([newCard])[0];
    this.gridItems.push(newItem);
    if (this.gridOptions.api?.optionsChanged) {
      this.gridOptions.api.optionsChanged();
    }
  }

  private handleCardDeleted(cardId: number | { id: number }): void {
    console.log('WebSocket: Card Deleted', cardId);
    const id = typeof cardId === 'object' ? cardId.id : cardId;
    this.gridItems = this.gridItems.filter(item => item['id'] !== id);
    if (this.gridOptions.api?.optionsChanged) {
      this.gridOptions.api.optionsChanged();
    }
  }


  private handleCardUpdate(updatedCard: Card): void {
    const itemToUpdate = this.gridItems.find(item => item['id'] === updatedCard.id);

    if (itemToUpdate) {
      // Update visual/data properties immediately
      itemToUpdate['title'] = updatedCard.title;
      itemToUpdate['subtitle'] = updatedCard.subtitle;
      itemToUpdate['chart_type'] = updatedCard.chart_type;
      itemToUpdate['title_size'] = updatedCard.title_size;
      itemToUpdate['title_color'] = updatedCard.title_color;
      itemToUpdate['subtitle_size'] = updatedCard.subtitle_size;

      // Check key gridster properties changes
      if (
        itemToUpdate.x !== updatedCard.position_x ||
        itemToUpdate.y !== updatedCard.position_y ||
        itemToUpdate.cols !== updatedCard.width ||
        itemToUpdate.rows !== updatedCard.height
      ) {
        console.log(`WebSocket: Layout update for card ${updatedCard.id}`);
        itemToUpdate.x = updatedCard.position_x;
        itemToUpdate.y = updatedCard.position_y;
        itemToUpdate.cols = updatedCard.width;
        itemToUpdate.rows = updatedCard.height;

        if (this.gridOptions.api?.optionsChanged) {
          this.gridOptions.api.optionsChanged();
        }
      }
    }
  }

  private mapCardsToGridItems(cards: Card[]): GridsterItem[] {
    return cards.map(card => ({
      id: card.id,
      x: card.position_x,
      y: card.position_y,
      cols: card.width,
      rows: card.height,

      title: card.title,
      subtitle: card.subtitle,
      title_size: card.title_size,
      title_color: card.title_color,
      subtitle_size: card.subtitle_size,
      chart_type: card.chart_type
    }));
  }
}

