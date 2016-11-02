import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CORE_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';
import {PreviewRatesService, RatesPreviewRange} from '../services/preview-rates.service';
import {UIRouter} from "ui-router-ng2";

declare var $: JQueryStatic;

@Component({
    template: `
  <!--      
       <h1>Preview Rates</h1>

        <div class="ui grid" style="margin-bottom: 10px">
            <div class="two wide column right floated">
              <button (click)="backToTariffConfig()" class="ui button">Go Back</button>
            </div>        
        </div>

        <hr />
  -->      

        <div class="ui grid">
            <div class="ui three wide column grid">

              <div class="ui slider checkbox row">
                <input name="first-axis" type="checkbox" [(ngModel)]="losFirst" (change)="updateCharts()">
                <label>Use LoS as X axis</label>
              </div>

              <div class="row">
                  <button class="ui button" (click)="toggleAllSeries()">{{showAllSeries ? "Disable all series" : "Show All Series"}}</button>
              </div>

              <div class="row">
                  <select [(ngModel)]="chartType" (ngModelChange)="changeChartType($event)" name="season_mode">
                    <option [value]="'line'">Line Chart</option>
                    <option [value]="'column'">Column Chart</option>
                    <option [value]="'area'">Area Chart</option>
                  </select>
              </div>
            </div>
            <div id="rate-charts" class="ui thirteen wide column segment raised" style="height: 400px"></div>
        </div>
    `
})
export class PreviewRates implements OnInit, AfterViewInit{

    ranges: RatesPreviewRange = {
        arrival_date: [20170815, 20170923],
        los: [1,7],
        adults: "user input",
        children: "user input"
    }

    losFirst: boolean = false;

    showAllSeries: boolean = true;

    chartType: string = "line";

    template_options = {
                title: {
                    text: 'Tariff Rates Preview',
                    x: -20 //center
                },
                subtitle: {
                    text: 'Rates relating to arrival date',
                    x: -30
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: "Arrival Date"
                    }
                },
                yAxis: [{
                    title: {
                        text: '$/night',
                        align: "high",
                        offset: 0,
                        rotation: 0,
                        y: -20
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                    min: 0
                }],
                tooltip: {
                    valuePrefix: '$'
                },
                plotOptions: {
                    column: {
                        marker: {
                            enabled: false
                        },
                        dataLabels: {
                            enabled: true,
                            format: '${y}'
                        }
                    },
                    line: {
                        marker: {
                            enabled: false
                        }
                    },
                    area: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                legend: {
                    enabled: true
                },
                chart: {
                },
                series: []
            };

    options: any;

    updateCharts(): void {
        console.log(`losFirst is ${this.losFirst}`);

        // losFirst is still false when it is going to be turned on.
        if (!this.losFirst) {
            this.previewRates.ranges$.next({
                arrival_date: "user input",
                los: [1,38],
                adults: "user input",
                children: "user input"
            });
        } else {
            this.previewRates.ranges$.next(this.ranges);
        }
    }

    toggleAllSeries(): void {
        this.showAllSeries = !this.showAllSeries;
        $('#rate-charts').highcharts().series.map(s => {
            let updatedOptions = {visible: this.showAllSeries};
            s.update(updatedOptions);
        });
    }

    changeChartType(t: string): void {
        let updatedOptions = {chart: {type: t}};
        $('#rate-charts').highcharts().update(updatedOptions);
    }

    ngOnInit(): void {
        this.previewRates.ranges$.next(this.ranges);

        this.previewRates.ratesDisplay$.subscribe((d: Array<Array<number>>) => {

            if (this.losFirst) {
                this.options = $.extend(true, {}, this.template_options);

                this.options.subtitle.text = `Total $ relating to Lengh of Stay on ${this.previewRates.lastUserInput.arrival_date}`;

                this.options.xAxis.title.text = "Length of Stay";
                this.options.xAxis.categories = Array.apply(0, Array(d[0].length)).map((_,index) => index+1);

                this.options.yAxis[0].title.text = "Total $"

                this.options.chart.type = this.chartType;

                this.options.legend.enabled = false;

                this.options.series[0] = {};

                this.options.series[0].name = "Length of Stay";

                this.options.series[0].data = d[0].map(v => v || undefined);
            } else {
                this.options = $.extend(true, {}, this.template_options);

                this.options.chart.type = this.chartType;

                this.options.xAxis.categories = [
                "Aug 15", "Aug 16", "Aug 17", "Aug 18", "Aug 19","Aug 20","Aug 21","Aug 22","Aug 23","Aug 24","Aug 25","Aug 26","Aug 27","Aug 28","Aug 29","Aug 30","Aug 31",
                "Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5","Sep 6","Sep 7","Sep 8","Sep 9","Sep 10","Sep 11","Sep 12","Sep 13","Sep 14","Sep 15","Sep 16","Sep 17",
                "Sep 18", "Sep 19","Sep 20","Sep 21","Sep 22","Sep 23"
                ];

                this.options.series = [];

                let los_num = d[0].length;

                for(let i = 0; i < los_num; i++) {
                    let s = {};
                    s['name'] = `los = ${i+1}`;

                    s['data'] = d.map(d => (d[i] > 0) ? Math.floor(d[i]/(i+1)) : undefined);

                    this.options.series.push(s);
                }
            }

            this.showAllSeries = true;

            $('#rate-charts')['highcharts'](this.options);
        });
    }

    ngAfterViewInit() {
        $('#rate-charts')['highcharts'](this.options);
    }

    backToTariffConfig(): void {
        this.uiRouter.stateService.go("app.arbitrary");
    }

    constructor(private previewRates: PreviewRatesService,  public uiRouter: UIRouter) {
    }
}