import {Component, Injectable, Input, AfterViewInit, OnInit} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';

import {DateData} from '../pojo/date-data';
import {UserInputData} from '../pojo/user-input-data';
import {RatePostData} from '../pojo/post-data';
import {TariffData, GroupData, SchemeData, DatePairData} from '../pojo/tariff-data';
import {YBIExistingTariffResponseResult, YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';

import {DateBarComponent} from '../date-bar';
import {DateDataService} from '../services/dateData.service';
import {RateCalcService} from '../services/rate-calc.service';

import {BlurForwarder} from '../directives/common';

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
                            <div class="four wide column"><input style="width: 100%" type="text" [(ngModel)]="postData.user_input.guests.adults"/></div>
                            <div class="four wide column"><input style="width: 100%" type="text" [(ngModel)]="postData.user_input.guests.children"/></div>
                        </div>
                        <div class="eight wide column">{{dateData.status}}</div>
                        <div class="eight wide column">{{dateData.session_exists}}</div>
                    </div>
                </div>
            </div>
            <div class="two wide column" style="height: 200px">
                <div class=""><b>Existing Tariff</b></div>
                <div class="ui header orange">{{existingTariff}}</div>
                <div class="ui divider"></div>
                <div class=""><b>TCEF</b></div>
                <div class="ui header blue">{{tcefTariff}}</div>
             </div>
             <div class="eight wide column">
               <div class="ui segment raised">
                    <div class="sixteen wide column"><b>Existing Tariff Calc Detail</b></div>
                    <div class="ui divider"></div>
                    <div [innerHtml]="calcMessage"></div>
               </div>
             </div>
             <div class="eight wide column">
               <div class="ui segment raised">
                    <div class="sixteen wide column"><b>TCEF Calc Detail</b></div>
                    <div class="ui divider"></div>
                    <div></div>
               </div>
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
                                        <div class="ui labeled input">
                                            <div class="ui label">
                                              <i class="dollar icon"></i>
                                            </div>
                                            <input name="base price" placeholder="$dollar" [(ngModel)]="postData.tariff.base_nightly" type="text">
                                       </div>
                                      </div>
                                      <div class="field">
                                        <label for="booking fee">Booking Fee</label>
                                        <div class="ui labeled input">
                                            <div class="ui label">
                                                  <i class="dollar icon"></i>
                                                </div>
                                            <input name="booking fee" placeholder="$dollar" [(ngModel)]="postData.tariff.Bfee" type="text">
                                        </div>
                                      </div>
                                      <div class="field">
                                        <label for="bond">Bond</label>
                                        <div class="ui labeled input">
                                            <div class="ui label">
                                                   <i class="dollar icon"></i>
                                             </div>
                                            <input name="bond" placeholder="$dollar" [(ngModel)]="postData.tariff.bond" type="text">
                                        </div>
                                      </div>                                      
                                  </div>
                            </div>
                            <div class="field">
                                  <div class="three fields">
                                    <div class="field">
                                      <label for="cleaning base">Cleaning Base</label>
                                      <div class="ui labeled input">
                                            <div class="ui label">
                                                  <i class="dollar icon"></i>
                                             </div>
                                            <input name="cleaning base" placeholder="$dollar" [(ngModel)]="postData.tariff.cpb" type="text">
                                     </div>
                                    </div>
                                    <div class="field">
                                      <label for="cleaning per block">Cleaning $/block</label>
                                      <div class="ui labeled input">
                                            <div class="ui label">
                                                  <i class="dollar icon"></i>
                                            </div>
                                            <input name="cleaning per block" placeholder="$dollar" [(ngModel)]="postData.tariff.cpd" type="text">
                                     </div>
                                    </div>
                                    <div class="field">
                                      <label for="cleaning day block">Cleaning days/block</label>
                                      <div class="ui labeled input">
                                            <div class="ui label">
                                                   <i class="calendar icon"></i>
                                            </div>
                                            <input name="cleaning day block" placeholder="number of days" [(ngModel)]="postData.tariff.cds" type="text">
                                      </div>
                                    </div>                                    
                                  </div>
                            </div>
                            <div class="field">
                                  <div class="six fields">
                                      <div class="field">
                                        <label for="guest min">Guest <br/>Min Number</label>
                                        <div class="ui labeled input">
                                                <div class="ui label">
                                                           <i class="users icon"></i>
                                                </div>
                                                <input name="guest min" placeholder="Min. Number" [(ngModel)]="postData.tariff.guest_min" type="text">
                                        </div>
                                      </div>
                                      <div class="field">
                                        <label for="guest max">Guest <br/>Max Number</label>
                                        <div class="ui labeled input">
                                                <div class="ui label">
                                                           <i class="users icon"></i>
                                                </div>                                        
                                                <input name="guest max" placeholder="Max. Number" [(ngModel)]="postData.tariff.guest_max" type="text">
                                        </div>
                                      </div>
                                      <div class="field">
                                        <label for="guest above">Adult Surchage Above</label>
                                        <div class="ui labeled input">
                                                <div class="ui label">
                                                       <i class="user icon"></i>
                                                </div>   
                                                <input name="guest above" placeholder="adults num" [(ngModel)]="postData.tariff.guest_above" type="text">
                                       </div>
                                      </div>         
                                      <div class="field">
                                        <label for="guest surcharge">Adult Surchage Amount</label>
                                        <div class="ui labeled input">
                                                <div class="ui label">
                                                       <i class="dollar icon"></i>
                                                </div>                                         
                                                <input name="guest surcharge" placeholder="$dollar" [(ngModel)]="postData.tariff.guest_surcharge" type="text">
                                       </div>        
                                      </div> 
                                      <div class="field">
                                        <label for="children above">Children Surchage Above</label>
                                        <div class="ui labeled input">
                                                <div class="ui label">
                                                       <i class="child icon"></i>
                                                </div>                                         
                                                <input name="children above" placeholder="children num" [(ngModel)]="postData.tariff.child_above" type="text">
                                        </div>         
                                      </div>         
                                      <div class="field">
                                        <label for="children surcharge">Children Surchage Amount</label>
                                        <div class="ui labeled input">
                                                <div class="ui label">
                                                       <i class="dollar icon"></i>
                                                </div>                                         
                                                <input name="children surcharge" placeholder="$dollar" [(ngModel)]="postData.tariff.child_surcharge" type="text">
                                        </div>        
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
        <date-bar [dateData]="dateData" [itemId]="itemId" (dateSliderUpdated)="dateSliderUpdated($event)"></date-bar>
    </div>
    `,
  directives: [FORM_DIRECTIVES, DateBarComponent, BlurForwarder],
  inputs: ['dateData', 'itemId'],
  host: { '(input-blur)': 'onInputBlur($event)' },
})
export class TestUnit implements AfterViewInit, OnInit {

  dateSliderUpdated(dt: DateData): void {
    this.updatePostWithDateData(dt);
    this.rateCalcService.setCurrentPostData(this.postData);
  }

  updatePostWithDateData(dt: DateData): void {
    if (!dt) {
      return;
    }

    let user_input: UserInputData = <UserInputData>this.postData.user_input;
    user_input.arrival = this.dt_s2a(dt.booking_arrival);
    user_input.departure = this.dt_s2a(dt.booking_departure);

    if (dt.season_exists == "no seasons") {
      this.postData.tariff.test_scheme_override.groups = [];
    } else if (dt.season_exists == "1 season 1 p") {
      this.postData.tariff.test_scheme_override.groups = [1];
      if (!this.postData.tariff.test_seasons_override[1]) {
        this.postData.tariff.test_seasons_override[1] = { pairs: [] }
      }
      this.postData.tariff.test_seasons_override[1].pairs = [{
        from: this.dt_s2d(dt.season1_start),
        to: this.dt_s2d(dt.season1_end)
      }];
    } else if (dt.season_exists == "1 season 2 p") {
      this.postData.tariff.test_scheme_override.groups = [1];
      if (!this.postData.tariff.test_seasons_override[1]) {
        this.postData.tariff.test_seasons_override[1] = { pairs: [] }
      }
      this.postData.tariff.test_seasons_override[1].pairs = [{
        from: this.dt_s2d(dt.season1_start),
        to: this.dt_s2d(dt.season1_end)
      }, {
          from: this.dt_s2d(dt.season2_start),
          to: this.dt_s2d(dt.season2_end)
        }];
    } else if (dt.season_exists == "2 seasons") {
      this.postData.tariff.test_scheme_override.groups = [1,2];
      if (!this.postData.tariff.test_seasons_override[1]) {
        this.postData.tariff.test_seasons_override[1] = { pairs: [] }
      }
      this.postData.tariff.test_seasons_override[1].pairs = [{
        from: this.dt_s2d(dt.season1_start),
        to: this.dt_s2d(dt.season1_end)
      }];
      if (!this.postData.tariff.test_seasons_override[2]) {
        this.postData.tariff.test_seasons_override[2] = { pairs: [] }
      }
      this.postData.tariff.test_seasons_override[2].pairs = [{
        from: this.dt_s2d(dt.season2_start),
        to: this.dt_s2d(dt.season2_end)
      }];
    } 
  }

  tempPair: DatePairData[] = [
    {
      "from": "15/08/2017",
      "to": "17/08/2017"
    },
    {
      "from": "20/09/2017",
      "to": "23/09/2017"
    }
  ];

  calcMessage: string = "";

  seasonModeChange(mode: string) {

    if (this.dateData.season_exists == "no seasons") {
      this.postData.tariff.test_scheme_override.groups = [];

    } else if (this.dateData.season_exists == "1 season 1 p") {
      this.postData.tariff.test_scheme_override.groups = [1];

      if (!this.postData.tariff.test_seasons_override[1]) {
        this.postData.tariff.test_seasons_override[1] = {pairs: []};
      }

      let existing_pairs_1: DatePairData[] = this.postData.tariff.test_seasons_override[1].pairs;
      existing_pairs_1[0] = existing_pairs_1[0] || this.tempPair[0];
      existing_pairs_1.splice(1, existing_pairs_1.length - 1);

    } else if (this.dateData.season_exists == "1 season 2 p") {
      this.postData.tariff.test_scheme_override.groups = [1];

      if (!this.postData.tariff.test_seasons_override[1]) {
        this.postData.tariff.test_seasons_override[1] = {pairs: []};
      }

      let existing_pairs_1: DatePairData[] = this.postData.tariff.test_seasons_override[1].pairs;
      let existing_pairs_2: DatePairData[] = this.postData.tariff.test_seasons_override[2]?this.postData.tariff.test_seasons_override[2].pairs:[];
      existing_pairs_1[0] = existing_pairs_1[0] || this.tempPair[0];
      existing_pairs_1[1] = existing_pairs_1[1] || existing_pairs_2[0] || this.tempPair[1];

    } else if (this.dateData.season_exists == "2 seasons") {
      this.postData.tariff.test_scheme_override.groups = [1,2];

      if (!this.postData.tariff.test_seasons_override[1]) {
        this.postData.tariff.test_seasons_override[1] = {pairs: []};
      }

      if (!this.postData.tariff.test_seasons_override[2]) {
        this.postData.tariff.test_seasons_override[2] = {pairs: []};
      }

      let existing_pairs_1: DatePairData[] = this.postData.tariff.test_seasons_override[1].pairs;
      let existing_pairs_2: DatePairData[] = this.postData.tariff.test_seasons_override[2].pairs;
      existing_pairs_1[0] = existing_pairs_1[0] || this.tempPair[0];
      existing_pairs_2[0] = existing_pairs_2[0] || this.tempPair[1];
    }

    this.rateCalcService.setCurrentPostData(this.postData);
  }

  // Convert from ["2017", "8", "15"] to "Aug 15"
  dt_a2s(a: number[]): string {
    var mon = "";
    if (!a || !Array.isArray(a) || a.length != 3) {
      console.warn("Error change date array to string!");
      return "";
    }
    if (a[1] == 9) {
      mon = "Sep";
    } else if (a[1] == 8) {
      mon = "Aug";
    }
    return `${mon} ${a[2]}`;
  }

  // Convert from "Aug 15" to ["2017", "8", "15"]
  dt_s2a(s: string): number[] {
    var md = s.split(/\s+/);
    if (!md || !Array.isArray(md) || md.length != 2) {
      console.log(md);
      console.warn("Error converting date string to array!");
      return [];
    }
    if (md[0] == "Aug") {
      return [2017, 8, parseInt(md[1])];
    } else if (md[0] == "Sep") {
      return [2017, 9, parseInt(md[1])];
    }
    return [];
  }

  // Convert from "Aug 15" to "15/08/2017"
  dt_s2d(s: string): string {
    var md = s.split(/\s+/);
    var result = null;
    if (!md || !Array.isArray(md) || md.length != 2) {
      console.warn("Error converting MMM dd to dd/MM/yyyy!");
      return null;
    }
    if (md[0] == "Aug") {
      result = `${parseInt(md[1])}/08/2017`;
    } else if (md[0] == "Sep") {
      result = `${parseInt(md[1])}/09/2017`;
    } else {
  }
    return result;
  }

  // Convert from "09/08/2017" to "Aug 9"
  dt_d2s(d: string): string {
    var md = d.split(/\//);
    if (!md || !Array.isArray(md) || md.length != 3) {
      console.warn("Error converting dd/MM/yyyy to MMM dd!");
      return null;
    }
    if (parseInt(md[1]) == 8) {
      return `Aug ${parseInt(md[0])}`;
    } else if (parseInt(md[1]) == 9) {
      return `Sep ${parseInt(md[0])}`;
    }
    return null;
  }

  dateData: DateData = {
    booking_arrival: "",
    booking_departure: "",
    season1_start: "",
    season1_end: "",
    season2_start: "",
    season2_end: "",
    season_exists: "no seasons"
  };

  postData: RatePostData;

  booking_arrival: string;
  booking_departure: string;
  season1_start: string;
  season1_end: string;
  season2_start: string;
  season2_end: string;

  existingTariff: number;
  tcefTariff: number;

  itemId: number;

  ngOnInit() {
    this.rateCalcService.currentPostData.subscribe((postData: RatePostData) => {
      this.postData = postData;
      var user_input: UserInputData;
      if (Array.isArray(postData.user_input)) {
        user_input = postData.user_input[0];
      } else {
        user_input = <UserInputData>postData.user_input;
      }
      this.dateData.booking_arrival = this.dt_a2s(user_input.arrival);
      this.dateData.booking_departure = this.dt_a2s(user_input.departure);

      if (postData.tariff.test_scheme_override.groups) {
        if (postData.tariff.test_scheme_override.groups.length == 0) {
          this.dateData.season_exists = "no seasons";
        } else if (postData.tariff.test_scheme_override.groups.length == 2) {
          this.dateData.season_exists = "2 seasons";
          let group1: GroupData = postData.tariff.test_seasons_override[1];
          let group2: GroupData = postData.tariff.test_seasons_override[2];

          this.dateData.season1_start = this.dt_d2s(group1.pairs[0].from);
          this.dateData.season1_end = this.dt_d2s(group1.pairs[0].to);
          this.dateData.season2_start = this.dt_d2s(group2.pairs[0].from);
          this.dateData.season2_end = this.dt_d2s(group2.pairs[0].to);
        } else if (postData.tariff.test_scheme_override.groups.length == 1) {
          let group1: GroupData = postData.tariff.test_seasons_override[1];
          if (group1.pairs.length > 1) {
            console.log(group1.pairs[0].from);
            this.dateData.season_exists = "1 season 2 p"
            this.dateData.season1_start = this.dt_d2s(group1.pairs[0].from);
            this.dateData.season1_end = this.dt_d2s(group1.pairs[0].to);
            this.dateData.season2_start = this.dt_d2s(group1.pairs[1].from);
            this.dateData.season2_end = this.dt_d2s(group1.pairs[1].to);
          } else {
            this.dateData.season_exists = "1 season 1 p"
            this.dateData.season1_start = this.dt_d2s(group1.pairs[0].from);
            this.dateData.season1_end = this.dt_d2s(group1.pairs[0].to);
          }
        }
      }

      this.dateDataService.setCurrentDateData(this.dateData);

      // this.dateData.season1_start = this.postData.tariff.test_seasons_override
    })
    this.rateCalcService.currentYBIResponse.subscribe((res: YBIExistingTariffResponse) => {
      if (res.result && res.result.length > 0) {
        this.existingTariff = res.result[0].total;
        this.calcMessage = res.result[0].desc;
        console.log(res.result[0]);
      }
    });
  }

  ngAfterViewInit() {
    $('.ui.accordion')['accordion']();
  }

  onInputBlur(value: any): void {
    this.rateCalcService.setCurrentPostData(this.postData);
  }

  constructor(public dateDataService: DateDataService, public rateCalcService: RateCalcService) {
    //this.dateDataService.setCurrentDateData(this.dateData);
    // setTimeout(() => {
    //   this.dateData.season_exists = "1 season 1 p";
    //   this.dateData.booking_arrival = "Sep 2";
    //   this.dateDataService.setCurrentDateData(this.dateData);
    // }, 3000);
  }
}