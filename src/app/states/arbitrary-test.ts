import  {Component, Input, Directive, OnInit} from '@angular/core';

import {RatePostData} from '../pojo/post-data';
import {YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';
import {TestPlanItem, TestDataRow} from '../pojo/test-plan';
import {TestPlanService} from '../services/test-plan.service';

import {Http, Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs/Rx';

import {TestUnit} from '../components/test-unit';

import {RateCalcService} from '../services/rate-calc.service';
import {UIRouter} from "ui-router-ng2";
import {environment} from "../environment";

@Component({
    selector: "arbitrary-test",
    template: `
    <div class="ui grid" style="margin-bottom: 10px">
          <div class="six wide column">
              <div class="ui header">
                Arbitrary Unit Test
              </div>
              <div>DIY your tariff parameters and check results</div>
          </div>
          <div *ngIf="fromState" class="two wide column right floated">
              <button (click)="goBack()" class="ui button">Go Back</button>
          </div>
          <div class="three wide column right floated">
              <button (click)="previewRates()" class="ui button">Preview Rates</button>
          </div>
      </div>
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
                   <div [innerHtml]="existingCalcMessage"></div>                
                </div>
            </div>
            <div class="eight wide column">
                <div class="ui segment raised" [ngClass]="resultMatch()?'':'inverted red'">
                   <div class="ui grid">
                       <span class="three wide column header" [class.green]="resultMatch()">$ \{{newTotal}}</span>
                       <span class="four wide column">{{newRent}} (R)</span>
                       <span class="three wide column">{{newGuest}} (G)</span>
                       <span class="three wide column">{{newBooking}} (B)</span>
                       <span class="three wide column">{{newClean}} (C)</span>
                   </div>
                   <div class="ui divider"></div>
                   <div [innerHtml]="newCalcMessage"></div>                                
                </div> 
            </div>
        </div>
        <div class="ui divider"></div>
        <test-unit  class="row" [itemId]="i" *ngFor='let i of testRepeat'></test-unit>
    </div>
    `,
    directives: [TestUnit]
})
export class ArbitraryTest implements OnInit {

    @Input('fromState') fromState: string;
    @Input('fromStateParams') fromStateParams: Object;

    testRepeat: number[] = Array.apply(null, Array(1)).map((d, i) => i);

    existingTotal: number;
    existingRent: number;
    existingGuest: number;
    existingClean: number;
    existingBond: number;
    existingBooking: number;
    existingCalcMessage: string;

    newTotal: number;
    newRent: number;
    newGuest: number;
    newClean: number;
    newBond: number;
    newBooking: number;
    newCalcMessage: string;

    subscriptionCurrentYBIRespnse: Subscription;
    subscriptionPostData: Subscription;

    goBack(): void {
      this.uiRouter.stateService.go(this.fromState, this.fromStateParams, null) ;
    }

    previewRates(): void {
      this.uiRouter.stateService.go("app.preview-rates");
    }

    resultMatch(): boolean {
      return this.existingTotal == this.newTotal;
    }

    ngOnInit(): void {

        this.rateCalcService.setCurrentPostData(this.rateCalcService.currentPostData);

        this.subscriptionPostData = this.rateCalcService.currentPostData$.flatMap((postData: RatePostData) =>
            this.http.post(`${environment.API_BASE}/test-tariff.pl`, JSON.stringify(postData)).map((res: Response) => <YBIExistingTariffResponse>res.json()))
        .subscribe((result: YBIExistingTariffResponse) => {
            this.rateCalcService.currentYBIResponse$.next(result);
        });

        this.subscriptionCurrentYBIRespnse = this.rateCalcService.currentYBIResponse$.subscribe((res: YBIExistingTariffResponse) => {
            if (res && res.result && res.result.length > 0) {
                console.log(JSON.stringify(res));
                this.existingTotal = parseInt(<any>res.result[0].total) + parseInt(<any>res.result[0].clean);
                this.existingRent = res.result[0].xgs;
                this.existingGuest = res.result[0].gs;
                this.existingBooking = res.result[0].Bfee;
                this.existingClean = res.result[0].clean;
                this.existingBond = res.result[0].bond;
                this.existingCalcMessage = res.result[0].desc;

                this.newTotal = parseInt(<any>res.result2[0].total) + parseInt(<any>res.result2[0].clean);
                this.newRent = res.result2[0].xgs;
                this.newGuest = res.result2[0].gs;
                this.newBooking = res.result2[0].Bfee;
                this.newClean = res.result2[0].clean;
                this.newBond = res.result2[0].bond;
                this.newCalcMessage = res.result2[0].desc;
                // console.log(res.result[0]);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptionPostData.unsubscribe();
        this.subscriptionCurrentYBIRespnse.unsubscribe();
    }

    constructor(public rateCalcService: RateCalcService, public http: Http, public uiRouter: UIRouter) {
    }
}