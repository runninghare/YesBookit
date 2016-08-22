import {Component, Injectable, bind} from '@angular/core';
import {DateData} from '../pojo/date-data';
import {UserInputData} from '../pojo/user-input-data';
import {TariffData} from '../pojo/tariff-data';
import {RulesData} from '../pojo/rules-data';
import {RatePostData} from '../pojo/post-data';
import {Subject, BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class RateCalcService {

    generateDummyPostData(): RatePostData {
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
    // currentDateData: Subject<DateData> = new BehaviorSubject<DateData>(null);

        // public setCurrentDateData(dateData: DateData): void {
        //     this.currentDateData.next(dateData);
        // }
    }
}

export var rateCalcServiceInjectable: Array<any> = [
  bind(RateCalcService).toClass(RateCalcService)
];