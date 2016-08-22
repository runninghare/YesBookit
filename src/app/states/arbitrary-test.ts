import  {Component, Input, Directive} from '@angular/core';

import {DateData} from '../pojo/date-data';
import {GuestData} from '../pojo/guest-data';
import {TariffData} from '../pojo/tariff-data';
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
    <test-unit [guestData]="guestData" [dateData]="dateData" [itemId]="i"></test-unit>
    `,
    directives: [TestUnit]
})
export class ArbitraryTest {

    testRepeat: number[] = Array.apply(null, Array(2)).map((d,i) => i);

    guestData: GuestData = {
        adults: 3,
        children: 1
    }

    dateData: DateData = {
        booking_arrival: "Aug 20",
        booking_departure: "Sep 6",
        season1_start: "Aug 20",
        season1_end: "Aug 28",
        season2_start: "Sep 5",
        season2_end: "Sep 16",
        season_exists: "2 seasons"
    };

    constructor(public rateCalcService: RateCalcService, public http: Http) {
        rateCalcService.setCurrentPostData(RateCalcService.generateDummyPostData());
        // rateCalcService.currentYBIResponse = rateCalcService.currentPostData.flatMap(() => http.get("tsconfig.json"));
        rateCalcService.currentYBIResponse = rateCalcService.currentPostData.flatMap((postData: RatePostData) => 
            http.post("http://app01.yesbookit.com/cgi-bin/test-tariff.pl", JSON.stringify(postData)).map((res: Response) => <YBIExistingTariffResponse>res.json() ));
    }
}