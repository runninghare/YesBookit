import  {Component, Injectable, Input, AfterViewInit} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import {DateBarComponent} from '../date-bar';
import {DateData} from '../pojo/date-data';
import {TestPlanItem} from '../pojo/test-plan';
import {DateDataService} from '../services/dateData.service';
declare var $: JQueryStatic;

@Component({
    selector: "suite",
    template: `
    <h1>{{testPlan.title}}</h1>
    <div class="ui piled segment" style="width: 840px">
        <div class="ui grid" style="width: 100%">
            <div class="five wide column">
                <div class="ui segment raised" style="height: 200px">
                    <div class="ui form">
                         <select class="form-control" [(ngModel)]="dateData.season_exists" (ngModelChange)="seasonModeChange($event)" name="season_mode">
                             <option [value]="'no seasons'">No Seasons</option>
                             <option [value]="'1 season 1 p'">1 season (1 period)</option>
                             <option [value]="'1 season 2 p'">1 season (2 periods)</option>
                             <option [value]="'2 seasons'">2 seasons</option>
                         </select>
                    </div>
                </div>
            </div>
            <div class="nine wide column">
                <div class="ui segment raised" style="height: 200px">
                    <div class="ui grid">
                        <div class="sixteen wide column"><b>Booking Info</b></div>
                        <div class="row padding-v-5">
                            <div class="three wide column"><b>Arr.</b></div>
                            <div class="three wide column"><b>Dep.</b></div>
                            <div class="two wide column"><b>LoS</b></div>
                            <div class="four wide column"><b>Adults</b></div>
                            <div class="four wide column"><b>Kids</b></div>
                        </div>
                        <div class="row padding-v-5">
                            <div class="three wide column">{{dateData.booking_arrival}}</div>
                            <div class="three wide column"> {{dateData.booking_departure}}</div>
                            <div class="two wide column">{{dateData.los}}</div>
                            <div class="four wide column"><input style="width: 100%" type="text" [(ngModel)]="guestData.adults"/></div>
                            <div class="four wide column"><input style="width: 100%" type="text" [(ngModel)]="guestData.kids"/></div>
                        </div>
                        <div class="eight wide column">{{dateData.status}}</div>
                        <div class="eight wide column">{{dateData.session_exists}}</div>
                    </div>
                </div>
            </div>
            <div class="two wide column" style="height: 200px">
                <div class=""><b>Expected</b></div>
                <div class="">100</div>
                <div class="ui divider"></div>
                <div class=""><b>Old Tariff</b></div>
                <div class="">100</div>
                <div class="ui divider"></div>
                <div class=""><b>TCEF</b></div>
                <div class="">100</div>
             </div>
             <div class="eight wide column" [hidden]="dateData.season_exists != '1 season 1 p' && dateData.season_exists != '2 seasons'  ">
                  <div class="ui styled accordion">
                      <div class="title">
                        <i class="dropdown icon"></i>
                        Season 1
                        <span class="season_base season-1" style="float: right">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      </div>
                      <div class="ui content grid">
                            <div class="row padding-v-5">
                                <div class="four wide column"><b>Start</b></div>
                                <div class="four wide column"><b>End</b></div>
                            </div>
                            <div class="row padding-v-5">
                                <div class="four wide column">{{dateData.season1_start}} </div>
                                <div class="four wide column">{{dateData.season1_end}}</div>
                            </div>
                      </div>
                  </div>
             </div>
             <div class="eight wide column" [hidden]="dateData.season_exists != '2 seasons' ">
                  <div class="ui styled accordion">
                      <div class="title">
                        <i class="dropdown icon"></i>
                        Season 2
                        <span class="season_base season-2" style="float: right">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      </div>
                      <div class="ui content grid">
                            <div class="row padding-v-5">
                                <div class="four wide column"><b>Start</b></div>
                                <div class="four wide column"><b>End</b></div>
                            </div>
                            <div class="row padding-v-5">
                                <div class="four wide column">{{dateData.season2_start}} </div>
                                <div class="four wide column">{{dateData.season2_end}}</div>
                            </div>
                      </div>
                  </div>
             </div>
             <div class="sixteen wide column" [hidden]="dateData.season_exists != '1 season 2 p'">
                  <div class="ui styled accordion">
                      <div class="title">
                        <i class="dropdown icon"></i>
                        Season 1
                        <span class="season_base season-1" style="float: right">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      </div>
                      <div class="ui content grid">
                            <div class="row padding-v-5">
                                <div class="four wide column"><b>Start (p1)</b></div>
                                <div class="four wide column"><b>End (p1)</b></div>
                                <div class="four wide column"><b>Start (p2)</b></div>
                                <div class="four wide column"><b>End (p2)</b></div>
                            </div>
                            <div class="row padding-v-5">
                                <div class="four wide column">{{dateData.season1_start}} </div>
                                <div class="four wide column">{{dateData.season1_end}}</div>
                                <div class="four wide column">{{dateData.season2_start}} </div>
                                <div class="four wide column">{{dateData.season2_end}}</div>
                            </div>
                      </div>
                  </div>
             </div>
        </div>
        <br />
        <date-bar [dateData]="dateData"></date-bar>
    </div>

    `,
    directives: [FORM_DIRECTIVES, DateBarComponent]
})
export class Suites implements AfterViewInit {

    @Input('testPlan') testPlan: TestPlanItem;

    seasonModeChange(mode: string) {
        this.dateDataService.setCurrentDateData(this.dateData);
    }

    guestData: any = {
        adults: 3,
        kids: 1
    }

    dateData: DateData = {
        booking_arrival: "Aug 20",
        booking_departure: "Sep 6",
        season1_start: "Aug 20",
        season1_end: "Aug 28",
        season2_start: "Sep 5",
        season2_end: "Sep 16",
        season_exists: "2 seasons"
    };

    ngAfterViewInit() {
        $('.ui.accordion')['accordion']();
    }

    constructor(public dateDataService: DateDataService) {
        this.dateDataService.setCurrentDateData(this.dateData);
    }
}