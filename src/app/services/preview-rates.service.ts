import {Injectable, bind} from '@angular/core';
import {UserInputData} from '../pojo/user-input-data';
import {TariffData} from '../pojo/tariff-data';
import {RulesData} from '../pojo/rules-data';
import {RatePostData} from '../pojo/post-data';
import {RateCalcService} from './rate-calc.service';
import {Http, Response} from '@angular/http';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';
import {environment} from "../";

declare var $: JQueryStatic;

export interface RatesPreviewRange {
    arrival_date: any|any[];
    los: any|any[];
    adults: any|any[];
    children: any|any[];
}

export interface RatesPreviewInput {
    ranges: RatesPreviewRange,
    tariff: TariffData,
    rules: RulesData
}

@Injectable()
export class PreviewRatesService {

    currentRatesDisplay$: Subject<Array<any>>;

    ratesDisplay$: Observable<any>;

    lastUserInput: UserInputData;

    ranges$: Subject<RatesPreviewRange> = new BehaviorSubject<RatesPreviewRange>(null);

    constructor(public rateCalcService: RateCalcService,  public http: Http) {
        // this.ranges$.subscribe(d => console.log(d));

        this.ratesDisplay$ = this.ranges$.combineLatest(rateCalcService.currentPostData$).map(data => {

            let user_input: UserInputData = $.extend(true, {}, data[0]);

            data[0].adults == "user input" && (user_input.adults = data[1].user_input['guests']['adults']);
            data[0].children == "user input" && (user_input.children = data[1].user_input['guests']['children']);

            if (data[0].arrival_date == "user input") {
                let arrival = moment([data[1].user_input['arrival'][0], data[1].user_input['arrival'][1]-1,data[1].user_input['arrival'][2]]);
                let last_day = moment([2017,8,23]);
                let max_los = (<any>last_day - <any>arrival)/86400000;

                user_input.arrival_date = arrival.format("YYYYMMDD");

                // console.log(`arrival is ${data[0].arrival_date}`);
                // console.log(`max_los = ${max_los}`);
            }

            this.lastUserInput = user_input;

            if (data[0] && data[1]) {
                return {
                    ranges: user_input,
                    tariff: data[1].tariff,
                    rules: data[1].rules
                }
            } else {
                return null;
            }
        }).flatMap((input: RatesPreviewInput) => this.http.post(`${environment.API_BASE}/test-calc-tcef-rates.pl`, JSON.stringify(input))).map((res: Response) => res.json());
    }
}

export var previewRatesServiceInjectable: Array<any> = [
  bind(PreviewRatesService).toClass(PreviewRatesService)
];