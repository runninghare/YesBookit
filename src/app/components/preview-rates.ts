import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CORE_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';
import {PreviewRatesService, RatesPreviewRange} from '../services/preview-rates.service';
import {HighChartsRenderer} from '../directives/common';
import {UIRouter} from "ui-router-ng2";

@Component({
    template: `
        <h1>Preview Rates</h1>

        <div class="ui grid" style="margin-bottom: 10px">
            <div class="two wide column right floated">
              <button (click)="backToTariffConfig()" class="ui button">Go Back</button>
            </div>        
        </div>

        <hr />
        <div id="rate-charts"></div>
    `,
    directives: [HighChartsRenderer]
})
export class PreviewRates implements OnInit, AfterViewInit{

    ranges: RatesPreviewRange = {
        arrival_date: [20170815, 20170923],
        los: [1,7],
        adults: 1,
        children: 0
    }

    options = {
                title: {
                    text: 'Tariff Rates Preview',
                    x: -20 //center
                },
                subtitle: {
                    text: 'Preview your rates',
                    x: -20
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories:  [
                    "Aug 15", "Aug 16", "Aug 17", "Aug 18", "Aug 19","Aug 20","Aug 21","Aug 22","Aug 23","Aug 24","Aug 25","Aug 26","Aug 27","Aug 28","Aug 29","Aug 30","Aug 31",
                    "Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5","Sep 6","Sep 7","Sep 8","Sep 9","Sep 10","Sep 11","Sep 12","Sep 13","Sep 14","Sep 15","Sep 16","Sep 17",
                    "Sep 18", "Sep 19","Sep 20","Sep 21","Sep 22","Sep 23"
                    ]
                },
                yAxis: [{
                    title: {
                        text: '$/night'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                }],
                tooltip: {
                    valuePrefix: '$'
                },
                plotOptions: {
                    line: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: []
            };

    ngOnInit(): void {
        this.previewRates.ranges$.next(this.ranges);

        this.previewRates.ratesDisplay$.subscribe((d: Array<Array<number>>) => {

            this.options.series = [];

            let los_num = d[0].length;

            for(let i = 0; i < los_num; i++) {
                let s = {};
                s['name'] = `los = ${i+1}`;

                s['data'] = d.map(d => (d[i] > 0) ? Math.floor(d[i]/(i+1)) : undefined);

                this.options.series.push(s);
            }

            console.log(`los_num is ${los_num}`);

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