import  {Component, Injectable, Input, AfterViewInit, OnInit, EventEmitter} from '@angular/core';
import {DateData} from './pojo/date-data';
import {DateDataService} from './services/dateData.service';
import {Subject, BehaviorSubject, Observable, Subscription} from 'rxjs/Rx';
declare var $: JQueryStatic;

@Component({
    selector: "date-bar",
    template: `

    <div style="height: 10px">
        <div [id]="'slider-range-season1-'+itemId" [hidden]="dateData.season_exists=='no seasons'" style="width: 1000px; position: absolute"></div>
        <div [id]="'slider-range-season2-'+itemId" [hidden]="dateData.season_exists=='1 season 1 p' || dateData.season_exists=='no seasons' " style="width: 1000px; position: absolute"></div>
    </div>
    <div class="ui row">
        <span *ngFor="let d of dateRange; let i = index" class="season_base" [ngClass]="classes[i]" >{{d}}</span>
    </div>
    <div [id]="'slider-range-booking-'+itemId" style="width: 1000px"></div>
    `,
    inputs: ['dateData', 'itemId'],
    outputs: ['dateSliderUpdated']
})
export class DateBarComponent  implements AfterViewInit, OnInit {

    dateData: DateData;
    itemId: number;

    slider1:  HTMLElement;
    slider2:  HTMLElement;

    season1SliderStream: Subject<DateData> = new BehaviorSubject<DateData>(null);
    season2SliderStream: Subject<DateData> = new BehaviorSubject<DateData>(null);
    bookingSliderStream: Subject<DateData> = new BehaviorSubject<DateData>(null);

    mergedDateStream: Observable<DateData>;

    // dateSliderStreamReady: EventEmitter<Observable<DateData>> = new EventEmitter<Observable<DateData>>();
    dateSliderUpdated: EventEmitter<DateData> = new EventEmitter<DateData>();

    exists(season: string): boolean {
        if (season == "season 1") {
            return this.dateData.season_exists != "no seasons";
        }
        if (season == "season 2") {
            return this.dateData.season_exists == "1 season 2 p" || this.dateData.season_exists == "2 seasons";
        }
        return false;
    }

    subscriptionCurrentDataData:  Subscription;
    subscriptionMergedStream: Subscription;

    ngOnInit() {
        this.subscriptionCurrentDataData = this.dateDataService.currentDateData.subscribe((dd: DateData) => {
            this.ngAfterViewInit();
        });

        var mergedDateStream: Observable<DateData> = this.season1SliderStream.merge(this.season2SliderStream).merge(this.bookingSliderStream);

        // this.mergedDateStream = mergedDateStream;

        // this.dateSliderStreamReady.emit(mergedDateStream);

        this.mergedDateStream = mergedDateStream.debounceTime(1000);

        this.subscriptionMergedStream = this.mergedDateStream.subscribe((dt: DateData) => {
            // console.log("=== check dt updates from merged stream ===");
            // console.log(dt);
            if (dt) {
                this.dateSliderUpdated.emit(dt);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptionMergedStream.unsubscribe();
        this.subscriptionCurrentDataData.unsubscribe();
    }

    dateRange: string[] = [
      "Aug 15", "Aug 16", "Aug 17", "Aug 18", "Aug 19","Aug 20","Aug 21","Aug 22","Aug 23","Aug 24","Aug 25","Aug 26","Aug 27","Aug 28","Aug 29","Aug 30","Aug 31",
      "Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5","Sep 6","Sep 7","Sep 8","Sep 9","Sep 10","Sep 11","Sep 12","Sep 13","Sep 14","Sep 15","Sep 16","Sep 17",
      "Sep 18", "Sep 19","Sep 20","Sep 21","Sep 22","Sep 23"
      ];

    classes: any[] = []; 

    constructor(public dateDataService: DateDataService) {
    }

    calcStatus(
        booking_arrival_idx: number,
        booking_departure_idx: number,
        season1_start_idx: number,
        season1_end_idx: number,
        season2_start_idx: number,
        season2_end_idx: number
    ): void {

        // console.log(`
        //     booking_arrival_idx: ${booking_arrival_idx},
        //     booking_departure_idx: ${booking_departure_idx},
        //     season1_start_idx: ${season1_start_idx},
        //     season1_end_idx: ${season1_end_idx},
        //     season2_start_idx: ${season2_start_idx},
        //     season2_end_idx: ${season2_end_idx}
        //     `);

        if (booking_arrival_idx < 0 || booking_departure_idx < 0) {
            this.dateData.status = "";
            return;
        }

        // Within one season
        if (booking_arrival_idx >= season1_start_idx && booking_departure_idx <= season1_end_idx ||
            booking_arrival_idx >= season2_start_idx && booking_departure_idx <= season2_end_idx
        ) {
            this.dateData.status = "Within one Season";
            return;
        } 

        // Not in season
        if (booking_arrival_idx > season1_end_idx && (!this.exists("season 2") || booking_departure_idx < season2_start_idx) ||
            booking_departure_idx < season1_start_idx ||
            this.exists("season 2") && booking_arrival_idx > season2_end_idx ||
            !this.exists("season 1")
            ) {
            this.dateData.status = "Not in seasons";
            return;
        }

        if (booking_arrival_idx < season1_start_idx && booking_departure_idx >= season1_start_idx && booking_departure_idx <= season1_end_idx ||
            this.exists("season 2") && booking_arrival_idx > season1_end_idx && booking_arrival_idx < season2_start_idx && booking_departure_idx >= season2_start_idx && booking_departure_idx <= season2_end_idx) {
            this.dateData.status = "Crossover: Enter a season (base + season)";
            return;
        }

        if (booking_arrival_idx >= season1_start_idx && booking_arrival_idx <= season1_end_idx && booking_departure_idx > season1_end_idx && (!this.exists("season 2") || booking_departure_idx < season2_start_idx) ||
            this.exists("season 2") && booking_arrival_idx >= season2_start_idx && booking_arrival_idx <= season2_end_idx && booking_departure_idx > season2_end_idx) {
            this.dateData.status = "Crossover: Leave a season (season + base)";
            return;
        }

        if (booking_arrival_idx < season1_start_idx && booking_departure_idx > season1_end_idx && (!this.exists("season 2") || booking_departure_idx < season2_start_idx) ||
            this.exists("season 2") && booking_arrival_idx > season1_end_idx && booking_arrival_idx < season2_start_idx && booking_departure_idx > season2_end_idx) {
            this.dateData.status = "Crossover: Fully include one season (base + season + base)";
            return;
        }

        if (this.exists("season 1") && this.exists("season 2") && booking_arrival_idx <= season1_end_idx && booking_departure_idx >= season2_start_idx && (season2_start_idx - season1_end_idx == 1)) {
            this.dateData.status = "Crossover: Include 2 adjacent seasons (season1 + season2)";
            return;
        }

        if (this.exists("season 1") && this.exists("season 2") && booking_arrival_idx <= season1_end_idx && booking_departure_idx >= season2_start_idx) {
            this.dateData.status = "Crossover: Include 2 seasons with base in between (season1 + base + season2)";
            return;
        }

        this.dateData.status = "";

    }

    ngAfterViewInit() {

        var booking_arrival_idx = this.dateRange.indexOf(this.dateData.booking_arrival);
        var booking_departure_idx = this.dateRange.indexOf(this.dateData.booking_departure);
        this.dateData.los = booking_departure_idx - booking_arrival_idx;
        var season1_start_idx = this.dateRange.indexOf(this.dateData.season1_start);
        var season1_end_idx = this.dateRange.indexOf(this.dateData.season1_end);
        var season2_start_idx = this.dateRange.indexOf(this.dateData.season2_start);
        var season2_end_idx = this.dateRange.indexOf(this.dateData.season2_end);

        $("#slider-range-booking-"+this.itemId)['slider']({
            range: true,
            min: 0,
            max: 39,
            values: [booking_arrival_idx, booking_departure_idx],
            slide: (event, ui) => {
                this.dateData.booking_arrival = this.dateRange[ui.values[0]];
                this.dateData.booking_departure = this.dateRange[ui.values[1]];
                this.dateData.los = ui.values[1] - ui.values[0];
                this.calcStatus(
                    this.dateRange.indexOf(this.dateData.booking_arrival), this.dateRange.indexOf(this.dateData.booking_departure),
                    this.dateRange.indexOf(this.dateData.season1_start), this.dateRange.indexOf(this.dateData.season1_end),
                    this.dateRange.indexOf(this.dateData.season2_start), this.dateRange.indexOf(this.dateData.season2_end)
                );

                this.bookingSliderStream.next(this.dateData);
                // this.dateSliderUpdated.emit(this.dateData);
            }
        });

        $("#slider-range-season1-"+this.itemId)['slider']({
            range: true,
            min: 0,
            max: 39,
            values: [season1_start_idx, season1_end_idx],
            slide: (event, ui) => {
                this.dateData.season1_start = this.dateRange[ui.values[0]];

                season2_start_idx = this.dateRange.indexOf(this.dateData.season2_start);

                this.dateData.season1_end = this.dateRange[this.exists("season 2") ? Math.min(season2_start_idx - 1, ui.values[1]) : ui.values[1]];
                for (let i = 0; i < (this.exists("season 2") ? this.dateRange.indexOf(this.dateData.season2_start) : 40); i++) {
                    if (i >= ui.values[0] && i <= ui.values[1]) {
                        this.classes[i] = "season-1";
                    } else {
                        this.classes[i] = "";
                    }
                }
                this.calcStatus(
                    this.dateRange.indexOf(this.dateData.booking_arrival), this.dateRange.indexOf(this.dateData.booking_departure),
                    this.dateRange.indexOf(this.dateData.season1_start), this.dateRange.indexOf(this.dateData.season1_end),
                    this.dateRange.indexOf(this.dateData.season2_start), this.dateRange.indexOf(this.dateData.season2_end)
                );

                this.season1SliderStream.next(this.dateData);
                // this.dateSliderUpdated.emit(this.dateData);
            }
        });

        $("#slider-range-season2-"+this.itemId)['slider']({
            range: true,
            min: 0,
            max: 39,
            values: [season2_start_idx, season2_end_idx],
            slide: (event, ui) => {
                this.dateData.season2_start = this.dateRange[Math.max(ui.values[0], this.dateRange.indexOf(this.dateData.season1_end) + 1)];
                this.dateData.season2_end = this.dateRange[ui.values[1]];
                for (let i = this.dateRange.indexOf(this.dateData.season1_end) + 1; i < 40; i++) {
                    if (i >= ui.values[0] && i <= ui.values[1]) {
                        this.classes[i] = this.dateData.season_exists == "2 seasons" ? "season-2" : "season-1";
                    } else {
                        this.classes[i] = "";
                    }
                }
                this.calcStatus(
                    this.dateRange.indexOf(this.dateData.booking_arrival), this.dateRange.indexOf(this.dateData.booking_departure),
                    this.dateRange.indexOf(this.dateData.season1_start), this.dateRange.indexOf(this.dateData.season1_end),
                    this.dateRange.indexOf(this.dateData.season2_start), this.dateRange.indexOf(this.dateData.season2_end)
                );

                this.season2SliderStream.next(this.dateData);
                // this.dateSliderUpdated.emit(this.dateData);
            }
        });

        for (let i = 0; i < 40; i++) {
            if (this.exists("season 1") && i >= season1_start_idx && i <= season1_end_idx) {
                this.classes[i] = "season-1";
            } else if (this.exists("season 2") && i >= season2_start_idx && i <= season2_end_idx) {
                this.classes[i] = this.dateData.season_exists == "2 seasons" ? "season-2" : "season-1";
            } else {
                this.classes[i] = "";
            }
        }

        $(`#slider-range-season1-${this.itemId} .ui-slider-range`).addClass('slide-season-1');
        $(`#slider-range-season2-${this.itemId} .ui-slider-range`).removeClass('slide-season-1').removeClass('slide-season-2')
            .addClass(this.dateData.season_exists == "2 seasons" ? "slide-season-2" : "slide-season-1");

        this.calcStatus(booking_arrival_idx, booking_departure_idx, season1_start_idx, season1_end_idx, season2_start_idx, season2_end_idx);

    }

}