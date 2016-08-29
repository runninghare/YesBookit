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
import {Observable, Subject, BehaviorSubject, Subscription} from 'rxjs/Rx';

declare var $: JQueryStatic;

@Component({
  selector: "test-unit",
  templateUrl: "views/test-unit.html",
  directives: [FORM_DIRECTIVES, DateBarComponent, BlurForwarder],
  inputs: ['itemId'],
  host: { '(input-blur)': 'onInputBlur($event)' },
})
export class TestUnit implements AfterViewInit, OnInit {

  testUnitInputChange: Subject<any> = new BehaviorSubject<any>(null);
  debouncedTestUnitInputChange: Observable<any> = this.testUnitInputChange.debounceTime(300);

  dateSliderUpdated(dt: DateData): void {
    this.updatePostWithDateData(dt);

    console.log("=== update postData due to dateSliderUpdated ===")
    this.rateCalcService.setCurrentPostData(this.postData);
  }

  seasonRateUpdate(val: any): void {
    console.log("=== update postData due to seasonRateUpdate ===");
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

    // console.log("=== update post data due to season mode change ===");
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

  updateDtWithPostData(postData: RatePostData): void {
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
  }

  subscriptionCurrentPostData: Subscription;
  subscriptionCurrentYBIResponse: Subscription;

  ngOnInit() {
    this.subscriptionCurrentPostData = this.rateCalcService.currentPostData$.subscribe((postData: RatePostData) => {
      if (postData) {
        this.postData = postData;
        this.updateDtWithPostData(postData);
      }
      // this.dateData.season1_start = this.postData.tariff.test_seasons_override
    });

    this.subscriptionCurrentYBIResponse = this.rateCalcService.currentYBIResponse$.subscribe((res: YBIExistingTariffResponse) => {
      if (res && res.post_data) {
        this.postData = res.post_data;
        this.updateDtWithPostData(res.post_data);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionCurrentYBIResponse.unsubscribe();
    this.subscriptionCurrentPostData.unsubscribe();
  }

  ngAfterViewInit() {
    $('.ui.accordion')['accordion']();
  }

  onInputBlur(value: any): void {
    this.testUnitInputChange.next(1);
  }

  constructor(public dateDataService: DateDataService, public rateCalcService: RateCalcService) {
    this.debouncedTestUnitInputChange.subscribe((dt) => {

      // console.log("=== update post data due to debounced UI input change ===");
      // console.log(dt);

      if (dt) {
        this.rateCalcService.setCurrentPostData(this.postData);
      }
    });
    //this.dateDataService.setCurrentDateData(this.dateData);
    // setTimeout(() => {
    //   this.dateData.season_exists = "1 season 1 p";
    //   this.dateData.booking_arrival = "Sep 2";
    //   this.dateDataService.setCurrentDateData(this.dateData);
    // }, 3000);
  }
}