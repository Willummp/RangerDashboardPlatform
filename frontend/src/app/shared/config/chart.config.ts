import { ChartType } from '../enums/chart-type.enum';

export interface ChartConfigItem {
    label: string;
    icon: string;
    description: string;
}

export const CHART_CONFIG: Record<ChartType | string, ChartConfigItem> = {
    [ChartType.BAR]: {
        label: 'Gráfico de Barras',
        icon: '📊',
        description: 'Comparação entre categorias.'
    },
    [ChartType.PIE]: {
        label: 'Gráfico de Pizza',
        icon: '🥧',
        description: 'Proporções de um todo.'
    },
    [ChartType.DOUGHNUT]: {
        label: 'Gráfico de Rosca',
        icon: '🍩',
        description: 'Similar ao pizza, com centro vazio.'
    },
    [ChartType.FUNNEL]: {
        label: 'Funil de Vendas',
        icon: '🌪️',
        description: 'Estágios de um processo linear.'
    },
    [ChartType.LINE]: {
        label: 'Gráfico de Linha',
        icon: '📈',
        description: 'Tendências ao longo do tempo.'
    },
    [ChartType.AREA]: {
        label: 'Gráfico de Área',
        icon: '⛰️',
        description: 'Volume e tendência acumulada.'
    }
};
