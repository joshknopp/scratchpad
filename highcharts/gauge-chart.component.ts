import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    ViewChild,
    ElementRef,
    ChangeDetectionStrategy
} from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_solidgauge from 'highcharts/modules/solid-gauge';
import {
    Observable,
    Subscription
} from 'rxjs';
import {
    HighchartsChartComponent
} from 'highcharts-angular'; // Import HighchartsChartComponent

// Initialize the solid-gauge module
HC_solidgauge(Highcharts);

// Define an interface for your series data
export interface GaugeSeriesData {
    name: string;
    value: number;
    max: number;
}

@Component({
    selector: 'app-gauge-chart',
    template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 100%; display: block;"
    ></highcharts-chart>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush // Optimize change detection
})
export class GaugeChartComponent implements OnInit, OnDestroy {
    @Input() data$ !: Observable < GaugeSeriesData[] > ; // Input observable for data
    @Input() minRadiusPercent: number = 40;
    @Input() maxRadiusPercent: number = 100;
    @Input() titleText: string = 'Dynamic Multi-Series Gauge';

    @ViewChild(HighchartsChartComponent, {
        static: false
    }) chartComponent ? : HighchartsChartComponent;

    Highcharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options = {};
    private dataSubscription: Subscription | undefined;

    ngOnInit() {
        this.initializeChartOptions();
        this.subscribeToData();
    }

    ngOnDestroy() {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }

    private initializeChartOptions(): void {
        this.chartOptions = {
            chart: {
                type: 'solidgauge',
                height: '110%'
            },
            title: {
                text: this.titleText,
                style: {
                    fontSize: '24px'
                }
            },
            tooltip: {
                backgroundColor: 'none',
                fixed: true,
                pointFormat: '<span style="font-size: 1.2em; color: {point.color}; font-weight: bold">{series.name}: {point.y}</span>',
                position: {
                    align: 'center',
                    verticalAlign: 'middle'
                },
                style: {
                    fontSize: '16px'
                }
            },
            pane: {
                startAngle: -90,
                endAngle: 90,
                background: []
            },
            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        enabled: false
                    },
                    linecap: 'round',
                    stickyTracking: false,
                    rounded: true
                }
            },
            series: [] // Initial empty series
        };
    }

    private subscribeToData(): void {
        this.dataSubscription = this.data$.subscribe(data => {
            this.updateChart(data);
        });
    }

    private updateChart(seriesData: GaugeSeriesData[]): void {
        const numSeries = seriesData.length;
        let currentInnerRadius = this.minRadiusPercent;
        const seriesToAdd: Highcharts.SeriesOptionsType[] = [];
        const paneBackgrounds: Highcharts.PaneBackgroundOptions[] = [];

        // Calculate the step for radius distribution
        const radiusStep = (this.maxRadiusPercent - this.minRadiusPercent) / numSeries;

        seriesData.forEach((s, index) => {
            const outerRadius = currentInnerRadius + radiusStep;
            const scaledValue = (s.value / s.max) * 100;

            seriesToAdd.push({
                type: 'solidgauge', // Must specify type for each series
                name: s.name,
                data: [{
                    color: Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length],
                    radius: `${outerRadius}%`,
                    innerRadius: `${currentInnerRadius}%`,
                    y: scaledValue
                }]
            });

            paneBackgrounds.push({
                outerRadius: `${outerRadius}%`,
                innerRadius: `${currentInnerRadius}%`,
                backgroundColor: Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length] + '30',
                borderWidth: 0
            });

            currentInnerRadius = outerRadius;
        });

        // Update the chart options, this will trigger a redraw
        if (this.chartComponent && this.chartComponent.chart) {
            this.chartComponent.chart.update({
                pane: {
                    background: paneBackgrounds
                },
                series: seriesToAdd
            }, true);
        } else {
            // If chart is not yet initialized (e.g., during first data emission)
            this.chartOptions = {
                ...this.chartOptions,
                pane: {
                    background: paneBackgrounds
                },
                series: seriesToAdd
            };
        }
    }
}
