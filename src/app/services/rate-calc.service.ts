import {Component, Injectable, bind, OnInit} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {DateData} from '../pojo/date-data';
import {UserInputData} from '../pojo/user-input-data';
import {TariffData} from '../pojo/tariff-data';
import {RulesData} from '../pojo/rules-data';
import {RatePostData} from '../pojo/post-data';
import {YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';

@Injectable()
export class RateCalcService {

    static generateDummyPostData(): RatePostData {
        return {
            user_input: {
                guests: {
                    adults: 2,
                    children: 2
                },
                arrival: [2017, 8, 18],
                departure: [2017, 9, 10]
            },
            tariff: {
                "child_above": 0,
                "guest_above": 2,
                "base_nightly": 125,
                "guest_max": 10,
                "guest_min": 1,
                "child_surcharge": 7,
                "cpd": 3,
                "Bfee": 800,
                "exec": 0,
                "bond": 500,
                "cpb": 15,
                "cds": 3,
                "guest_surcharge": 11,
                "test_seasons_override": {
                    "1": {
                        "pairs": [
                            {
                                "to": "25/08/2017",
                                "from": "22/08/2017"
                            },
                            {
                                "from": "31/08/2017",
                                "to": "07/09/2017"
                            }
                        ]
                    }
                }
            }
        };
    }

    currentPostData: Subject<RatePostData> = new BehaviorSubject<RatePostData>(null);

    currentYBIResponse: Observable<YBIExistingTariffResponse>;

    public setCurrentPostData(postData: RatePostData): void {
        this.currentPostData.next(postData);
    }

    constructor() {
        // this.currentYBIResponse = this.currentPostData.flatMap((postData:RatePostData) => Observable.from([100,200,300]));
    }
}

export var rateCalcServiceInjectable: Array<any> = [
  bind(RateCalcService).toClass(RateCalcService)
];