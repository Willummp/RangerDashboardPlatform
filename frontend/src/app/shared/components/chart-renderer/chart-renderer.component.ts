import { Component, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { ChartType } from '../../enums/chart-type.enum';

@Component({
    selector: 'app-chart-renderer',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="chart-wrapper">
       <apx-chart
        [series]="chartOptions.series!"
        [chart]="chartOptions.chart!"
        [xaxis]="chartOptions.xaxis!"
        [labels]="chartOptions.labels!"
        [colors]="chartOptions.colors!"
        [plotOptions]="chartOptions.plotOptions!"
        [legend]="chartOptions.legend!"
        [dataLabels]="chartOptions.dataLabels!"
        [tooltip]="chartOptions.tooltip!"
        [stroke]="chartOptions.stroke!"
        [fill]="chartOptions.fill!"
      ></apx-chart>
    </div>
  `,
    styles: [`
    .chart-wrapper {
      width: 100%;
      height: 100%;
      display: block; /* Removed flex center that might constrain width */
      overflow: hidden; 
    }
    apx-chart {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class ChartRendererComponent implements OnChanges {
    @Input() type: ChartType = ChartType.BAR;
    @Input() title: string = '';

    public chartOptions: Partial<ApexOptions> = {};

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['type']) {
            this.generateChartOptions();
        }
    }

    private generateChartOptions(): void {
        const baseOptions: Partial<ApexOptions> = {
            chart: {
                type: this.mapChartType(this.type),
                height: '100%',
                width: '100%',
                fontFamily: 'Outfit, sans-serif',
                background: 'transparent',
                toolbar: { show: false },
                animations: { enabled: true }
            },
            colors: ['#3366FF', '#00D68F', '#FFAA00', '#FF3D71', '#0095FF'],
            legend: {
                position: 'bottom',
                labels: { colors: '#8F9BB3' }
            },
            tooltip: { theme: 'dark' },
            dataLabels: { enabled: false }
        };

        // MOCK DATA GENERATOR
        switch (this.type) {
            case ChartType.BAR:
                this.chartOptions = {
                    ...baseOptions,
                    series: [{ name: 'Vendas', data: [30, 40, 45, 50, 49, 60, 70, 91] }],
                    xaxis: {
                        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
                        labels: { style: { colors: '#8F9BB3' } }
                    },
                    plotOptions: { bar: { borderRadius: 4, horizontal: false } }
                };
                break;

            case ChartType.PIE:
            case ChartType.DOUGHNUT:
                this.chartOptions = {
                    ...baseOptions,
                    series: [44, 55, 13, 43, 22],
                    labels: ['Apple', 'Mango', 'Orange', 'Watermelon', 'Grapes'],
                    plotOptions: { pie: { donut: { size: '65%' } } }
                };
                // Apex expects 'donut' type string for doughnut charts
                if (baseOptions.chart) baseOptions.chart.type = this.type === ChartType.DOUGHNUT ? 'donut' : 'pie';
                break;

            case ChartType.FUNNEL:
                this.chartOptions = {
                    ...baseOptions,
                    series: [
                        {
                            name: "Funnel Series",
                            data: [1380, 1100, 990, 880, 580]
                        }
                    ],
                    plotOptions: {
                        bar: {
                            borderRadius: 0,
                            horizontal: true,
                            barHeight: '80%',
                            isFunnel: true,
                        },
                    },
                    xaxis: {
                        categories: [
                            'Sourced',
                            'Screened',
                            'Assessed',
                            'HR Interview',
                            'Hired',
                        ],
                        labels: { style: { colors: '#8F9BB3' } }
                    },
                };
                // Funnel is techincally a bar chart in apex until recent versions, but 'bar' with isFunnel: true
                if (baseOptions.chart) baseOptions.chart.type = 'bar';
                break;

            case ChartType.AREA:
            case ChartType.LINE:
                this.chartOptions = {
                    ...baseOptions,
                    series: [{ name: 'Sessões', data: [31, 40, 28, 51, 42, 109, 100] }],
                    xaxis: {
                        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        labels: { style: { colors: '#8F9BB3' } }
                    },
                    stroke: { curve: 'smooth', width: 3 },
                    fill: this.type === ChartType.AREA ? {
                        type: "gradient",
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.3,
                        }
                    } : undefined
                };
                break;

            default:
                this.chartOptions = baseOptions;
        }
    }

    // Helper to map our Enum to ApexCharts type string
    private mapChartType(type: ChartType): any {
        // Most map 1:1, but safety first
        switch (type) {
            case ChartType.DOUGHNUT: return 'donut';
            // Funnel is special in Apex, handled in plotOptions usually or type='bar'
            case ChartType.FUNNEL: return 'bar';
            default: return type.toLowerCase();
        }
    }
}
