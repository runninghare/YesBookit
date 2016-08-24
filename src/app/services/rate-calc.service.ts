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
                "group1_rate_type": "F",
                "group1_perrata_type": "PN",
                "group1_nightly": 5,
                "group1_optional_weekly":500.00,
                "test_scheme_override": {
                    "groups": [1]
                },
                "test_seasons_override": {
                    "1": {
                        "name": "Blue Season",
                        "pairs": [
                            {
                                "to": "25/08/2017",
                                "from": "22/08/2017"
                            },
                            {
                                "from": "15/09/2017",
                                "to": "22/09/2017"
                            }
                        ]
                    },
                    "2": {
                        "name": "Orange Season",
                        "pairs": [
                            {
                                "from": "15/9/2017",
                                "to": "22/9/2017"
                            }
                        ]
                    }
                }
            },
            rules: {
                "group1_adaysc_item1": "P",
                "group1_adaysid_item1": "RULE 1",
                "group1_adaysm_item1": "M",
                "group1_adaysn_item1": 20,
                "group1_adaysv_item1": 201,
                "group1_adaysc_item2": "P",
                "group1_adaysid_item2": "RULE 2",
                "group1_adaysm_item2": "L",
                "group1_adaysn_item2": 30,
                "group1_adaysv_item2": 168
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