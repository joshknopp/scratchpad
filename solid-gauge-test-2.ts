import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting'; // Optional: for exporting chart

// Initialize Highcharts modules
HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);

@Component({
  selector: 'app-solid-gauge-inside-labels',
  template: `
    <highcharts-chart [options]="chartOptions"></highcharts-chart>
  `,
  styles: []
})
export class SolidGaugeInsideLabelsComponent implements OnInit {
  chartOptions: Highcharts.Options = {};
  chart: Highcharts.Chart | undefined;

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'solidgauge',
        height: 400,
        events: {
          load: (chart) => {
            this.chart = chart.target;
            this.addCustomLabels();
          },
          redraw: () => {
            this.addCustomLabels(); // Update labels on redraw
          }
        }
      },

      title: {
        text: 'Solid Gauge with Inside Data Labels'
      },

      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{
          backgroundColor: '#E5E5E5',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }]
      },

      tooltip: {
        enabled: false // Disable default tooltip if custom labels show values
      },

      yAxis: {
        min: 0,
        max: 100,
        stops: [
          [0, '#DF5353'], // red
          [0.5, '#DDDF0D'], // yellow
          [1, '#55BF3B']  // green
        ],
        tickWidth: 0,
        minorTickInterval: 'auto',
        tickLength: 0,
        labels: {
          y: -20
        },
        title: {
          text: ''
        }
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false // Disable default data labels
          },
          lineWidth: '30%',
          roundedCorners: true,
          stickyTracking: false
        }
      },

      series: [{
        name: 'Series 1',
        data: [70]
      }, {
        name: 'Series 2',
        data: [30]
      }, {
        name: 'Series 3',
        data: [90]
      }, {
        name: 'Series 4',
        data: [10]
      }, {
        name: 'Series 5',
        data: [55]
      }]
    };
  }

  addCustomLabels() {
    if (!this.chart) {
      return;
    }

    // Remove previous custom labels
    this.chart.series.forEach(series => {
      if (series.customLabels) {
        series.customLabels.forEach((label: any) => label.destroy());
        series.customLabels = [];
      }
    });

    this.chart.series.forEach(series => {
      if (series.points && series.points.length > 0) {
        const point = series.points[0]; // Solid gauge usually has only one point
        const center = series.pane.center;
        const centerX = center[0];
        const centerY = center[1];
        const radius = center[2] / 2;
        const innerRadius = radius * 0.6; // Adjust inner radius for label position
        const outerRadius = radius * 0.8; // Adjust outer radius for label position
        const angle = (point.y / series.yAxis.max) * 360 - 90; // Calculate angle (adjust for 0 degrees at top)
        const radians = angle * Math.PI / 180;

        // Calculate label position inside the gauge arc
        const x = centerX + (innerRadius + (outerRadius - innerRadius) / 2) * Math.cos(radians);
        const y = centerY + (innerRadius + (outerRadius - innerRadius) / 2) * Math.sin(radians);

        // Create the text label
        const label = this.chart!.renderer.text(
          point.y.toString(), // Text to display
          x,
          y
        ).css({
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'black', // Customize label color
          textAlign: 'center' // Center text
        }).add();

        // Store the label on the series for later removal/update
        if (!series.customLabels) {
          series.customLabels = [];
        }
        series.customLabels.push(label);
      }
    });
  }
}
