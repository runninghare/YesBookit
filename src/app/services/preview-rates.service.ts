import {Injectable, bind} from '@angular/core';
import {UserInputData} from '../pojo/user-input-data';
import {TariffData} from '../pojo/tariff-data';
import {RulesData} from '../pojo/rules-data';
import {RatePostData} from '../pojo/post-data';
import {RateCalcService} from './rate-calc.service';
import {Http, Response} from '@angular/http';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';
import {environment} from "../";

export interface RatesPreviewRange {
    arrival_date: number|number[];
    los: number|number[];
    adults: number|number[];
    children: number|number[];
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

    ranges$: Subject<RatesPreviewRange> = new BehaviorSubject<RatesPreviewRange>(null);

    constructor(public rateCalcService: RateCalcService,  public http: Http) {
        // this.ranges$.subscribe(d => console.log(d));

        this.ratesDisplay$ = this.ranges$.combineLatest(rateCalcService.currentPostData$).map(data => {
            if (data[0] && data[1]) {
                return {
                    ranges: data[0],
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