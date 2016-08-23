import  {Component, Input, Directive} from '@angular/core';

import {RatePostData} from '../pojo/post-data';
import {YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';

import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import {TestUnit} from '../components/test-unit';

import {RateCalcService} from '../services/rate-calc.service';

@Component({
    selector: "arbitrary-test",
    template: `
    <h1>Arbitrary Unit Test</h1>
    <br />
    <test-unit  [itemId]="i" *ngFor='let i of testRepeat'></test-unit>
    `,
    directives: [TestUnit]
})
export class ArbitraryTest {

    testRepeat: number[] = Array.apply(null, Array(1)).map((d,i) => i);

    constructor(public rateCalcService: RateCalcService, public http: Http) {
        rateCalcService.setCurrentPostData(RateCalcService.generateDummyPostData());
        rateCalcService.currentYBIResponse = rateCalcService.currentPostData.flatMap((postData: RatePostData) => 
            http.post("http://app01.yesbookit.com/cgi-bin/test-tariff.pl", JSON.stringify(postData)).map((res: Response) => <YBIExistingTariffResponse>res.json() ));
    }
}