import {Component, Injectable, bind, OnInit} from '@angular/core';
import {DateData} from '../pojo/date-data';
import {UserInputData} from '../pojo/user-input-data';
import {TariffData} from '../pojo/tariff-data';
import {RulesData} from '../pojo/rules-data';
import {RatePostData} from '../pojo/post-data';
import {YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';
import {TestDataGeneratorService} from './test-data-generator.service';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';

@Injectable()
export class RateCalcService {

    currentPostData: RatePostData;

    currentPostData$: Subject<RatePostData>;

    currentYBIResponse$: Subject<YBIExistingTariffResponse>;

    public setCurrentPostData(postData: RatePostData): void {
        // console.log("=== set current post data ===")
        this.currentPostData = postData;
        this.currentPostData$.next(postData);
    }

    constructor() {
        this.currentPostData$ = new BehaviorSubject<RatePostData>(null);
        this.currentYBIResponse$ =  new BehaviorSubject<YBIExistingTariffResponse>(null);

        this.currentPostData = TestDataGeneratorService.defaultPostData;
    }
}

export var rateCalcServiceInjectable: Array<any> = [
  bind(RateCalcService).toClass(RateCalcService)
];