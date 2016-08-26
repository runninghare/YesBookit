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
    <div class="ui grid">
        <div class="row">
            <div class="eight wide column">
                <div class="ui segment raised">
                   <div class="ui grid">
                       <span class="three wide column header orange">$ \{{existingTotal}}</span>
                       <span class="four wide column">{{existingRent}} (R)</span>
                       <span class="three wide column">{{existingGuest}} (G)</span>
                       <span class="three wide column">{{existingBooking}} (B)</span>
                       <span class="three wide column">{{existingClean}} (C)</span>
                   </div>
                   <div class="ui divider"></div>
                   <div [innerHtml]="calcMessage"></div>                
                </div>
            </div>
            <div class="eight wide column">
                <div class="ui segment raised">
                     <div class="row">
                       <span class="ui header blue">$ {{tcefTariff}}</span>
                       <div class="ui blue label" style="float: right">TCEF Tariff</div>
                   </div>
                   <div class="ui divider"></div>
                   <div [innerHtml]="calcTcefMessage"></div>                   
                </div> 
            </div>
        </div>
        <div class="ui divider"></div>
        <test-unit  class="row" [itemId]="i" *ngFor='let i of testRepeat'></test-unit>
    </div>
    `,
    directives: [TestUnit]
})
export class ArbitraryTest {

    testRepeat: number[] = Array.apply(null, Array(1)).map((d, i) => i);

    existingTotal: number;
    existingRent: number;
    existingGuest: number;
    existingClean: number;
    existingBond: number;
    existingBooking: number;
    calcMessage: string;

    postData: RatePostData;

    constructor(public rateCalcService: RateCalcService, public http: Http) {
        rateCalcService.setCurrentPostData(RateCalcService.generateDummyPostData());
        rateCalcService.currentPostData.flatMap((postData: RatePostData) =>
            http.post("http://app01.yesbookit.com/cgi-bin/test-tariff.pl", JSON.stringify(postData)).map((res: Response) => <YBIExistingTariffResponse>res.json()))
        .subscribe((result: YBIExistingTariffResponse) => {
            rateCalcService.currentYBIResponse.next(result);
        });

        this.rateCalcService.currentYBIResponse.subscribe((res: YBIExistingTariffResponse) => {
            if (res && res.result && res.result.length > 0) {
                this.existingTotal = res.result[0].total;
                this.existingRent = res.result[0].xgs;
                this.existingGuest = res.result[0].gs;
                this.existingBooking = res.result[0].Bfee;
                this.existingClean = res.result[0].clean;
                this.existingBond = res.result[0].bond;
                this.calcMessage = res.result[0].desc;
                // console.log(res.result[0]);
            }
        });
    }
}