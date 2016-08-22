import  {Component, Injectable, Input, AfterViewInit} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';

import {DateData} from '../pojo/date-data';
import {GuestData} from '../pojo/guest-data';

import {DateBarComponent} from '../date-bar';
import {DateDataService} from '../services/dateData.service';
import {RateCalcService} from '../services/rate-calc.service';
declare var $: JQueryStatic;

@Component({
    selector: "test-unit",
    template: `
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
                            <div class="four wide column"><input style="width: 100%" type="text" [(ngModel)]="guestData.children"/></div>
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
             <div class="sixteen wide column">
               <div class="ui styled accordion" style="width: 100%">
                      <div class="title">
                        <i class="dropdown icon"></i>
                        Property Tariff Info
                      </div>
                      <div class="ui content form">
                              <div class="field">
                                  <div class="three fields">
                                      <div class="field">
                                        <label for="base price">Property Price</label>
                                        <input name="base price" placeholder="$dollar" type="text">
                                      </div>
                                      <div class="field">
                                        <label for="booking fee">Booking Fee</label>
                                        <input name="booking fee" placeholder="$dollar" type="text">
                                      </div>
                                      <div class="field">
                                        <label for="bond">Bond</label>
                                        <input name="bond" placeholder="$dollar" type="text">
                                      </div>                                      
                                  </div>
                            </div>
                            <div class="field">
                                  <div class="three fields">
                                    <div class="field">
                                      <label for="cleaning base">Cleaning Base</label>
                                      <input name="cleaning base" placeholder="$dollar" type="text">
                                    </div>
                                    <div class="field">
                                      <label for="cleaning per block">Cleaning $/block</label>
                                      <input name="cleaning per block" placeholder="$dollar" type="text">
                                    </div>
                                    <div class="field">
                                      <label for="cleaning day block">Cleaning days/block</label>
                                      <input name="cleaning day block" placeholder="number of days" type="text">
                                    </div>                                    
                                  </div>
                            </div>
                            <div class="field">
                                  <div class="six fields">
                                      <div class="field">
                                        <label for="guest min">Guest <br/>Min Number</label>
                                        <input name="guest min" placeholder="Min. Number" type="text">
                                      </div>
                                      <div class="field">
                                        <label for="guest max">Guest <br/>Max Number</label>
                                        <input name="guest max" placeholder="Max. Number" type="text">
                                      </div>
                                      <div class="field">
                                        <label for="guest above">Adult Surchage Above</label>
                                        <input name="guest above" placeholder="adults num" type="text">
                                      </div>         
                                      <div class="field">
                                        <label for="guest surcharge">Adult Surchage Amount</label>
                                        <input name="guest surcharge" placeholder="$dollar" type="text">
                                      </div> 
                                      <div class="field">
                                        <label for="children above">Children Surchage Above</label>
                                        <input name="children above" placeholder="children num" type="text">
                                      </div>         
                                      <div class="field">
                                        <label for="children surcharge">Children Surchage Amount</label>
                                        <input name="children surcharge" placeholder="$dollar" type="text">
                                      </div>                                                                                                                                                    
                                  </div>
                            </div>                            
                      </div>     
                  </div>
             </div>
             <div class="sixteen wide column">
               <div class="ui styled accordion" style="width: 100%">
                      <div class="title">
                        <i class="dropdown icon"></i>
                        Seasonal Tariff
                      </div>
                      <div class="ui content form">
                      </div>
                  </div>
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
        <date-bar [dateData]="dateData" [itemId]="itemId"></date-bar>
    </div>
    `,
    directives: [FORM_DIRECTIVES, DateBarComponent],
    inputs: ['guestData', 'dateData', 'itemId']
})
export class TestUnit implements AfterViewInit {

    seasonModeChange(mode: string) {
        this.dateDataService.setCurrentDateData(this.dateData);
    }

    guestData: GuestData;
    dateData: DateData;
    itemId: number;

    ngAfterViewInit() {
        $('.ui.accordion')['accordion']();
    }

    constructor(public dateDataService: DateDataService) {
        this.dateDataService.setCurrentDateData(this.dateData);
        setTimeout(() => {
          this.dateData.season_exists = "1 season 1 p";
          this.dateData.booking_arrival = "Sep 2";
          this.dateDataService.setCurrentDateData(this.dateData);
        }, 3000);
    }
}