import  {Component, Input, Directive, OnInit} from '@angular/core';

import {DateData} from '../pojo/date-data';
import {GuestData} from '../pojo/guest-data';
import {RatePostData} from '../pojo/post-data';
import {TestDataGeneratorService} from '../services/test-data-generator.service';
import {YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';

import {TestPlanService} from '../services/test-plan.service';
import {TestPlanItem, TestDataRow} from '../pojo/test-plan';
import {TestVectors} from '../services/test-vector.service';
import {RateCalcService} from '../services/rate-calc.service';
import {Observable, Subject, BehaviorSubject, Subscription, ReplaySubject} from 'rxjs/Rx';

import {TestUnit} from '../components/test-unit';
import {UiTableConfig, UiTable, UITableAction, UiTableOptions} from '../components/ui-table';

import {UIRouter} from "ui-router-ng2";

@Component({
    selector: "suite",
    template: `
      <div class="ui grid" style="margin-bottom: 10px">
          <div class="six wide column">
              <div class="ui header">
                {{testItem.title}}
              </div>
              <div>{{testItem.description}}</div>
          </div>
          <div class="two wide column">
              <div class="ui statistic green">
                  <div class="value">{{testItem.numOfSuccesses}}</div>
                  <div class="label">Success</div>
              </div>
          </div>
          <div class="two wide column">
              <div class="ui statistic red">
                  <div class="value">{{testItem.numOfFailures}}</div>
                  <div class="label">Failure</div>
              </div>
          </div>
          <div class="two wide column">
              <div class="ui statistic blue">
                  <div class="value">{{testItem.numOfTests}}</div>
                  <div class="label">Total</div>
              </div>
          </div>
          <div class="four wide column right floated">
              <button (click)="runTests()" class="ui primary button">Run Tests</button>
              <button (click)="stopTests()" class="ui button">Stop Tests</button>
          </div>
      </div>
      <ui-table [tableConfig]="testItem.testResultConfig" [tableActions]="tableActions" [dataSource]="testItem.currentResultData$"></ui-table>
    <!--
    <test-unit [guestData]="guestData" [dateData]="dateData" [itemId]="i"></test-unit>
    -->
    `,
    directives: [TestUnit, UiTable]
})
export class Suites {

    @Input('name') name: string;

    testRepeat: number[] = Array.apply(null, Array(2)).map((d,i) => i);

    testItem: TestPlanItem;

    testData: Subject<TestDataRow[]>;

    tableActions: UITableAction;

    ngOnDestroy(): void {
        // this.stopTests();
    }

    ngOnInit(): void {
        this.testItem = this.testPlanService.getTestPlanItems().filter((item: TestPlanItem) => item.name == this.name)[0];

        if (!this.testItem.currentResultData$) {
            this.testItem.currentResultData$ = new BehaviorSubject<TestDataRow[]>([]);
        }

        let current_suite = this.name;

        class Action extends UITableAction {
            applyRowClasses(row: TestDataRow): string {
                return TestDataGeneratorService.ybiTestResultEvaluation(row, () => "positive testrow", () => "negative testrow");
            }
            
            clickRow(row: any): void {
                let res = TestDataGeneratorService.ybiTableRowToResponse(row);

                // console.log("=== row ===");
                // console.log(row);
                // console.log(JSON.stringify(res));

                Suites.rateCalcService.currentPostData = res.post_data;
                Suites.rateCalcService.currentYBIResponse$.next(res);
                Suites.uiRouter.stateService.go("app.arbitrary", {fromStateParams: {name: current_suite}, fromState: "app.suites"}, null) ;
            }

            convertRowData(row: TestDataRow): TestDataRow {
                return  TestDataGeneratorService.ybiRowDataConverter(row);
            }
        }

        this.tableActions = new Action();
    }

    static rateCalcService: RateCalcService;

    runTests(): void {
        this.testItem.numOfSuccesses = 0;
        this.testItem.numOfFailures = 0;
        this.testItem.currentResultData$.next([]);

        this.stopTests();

        this.testItem.testResultData$ = this.testPlanService.createTestResult(this.testItem);

        this.testItem.testResultSubscription = this.testItem.testResultData$.subscribe(r => {
            this.testItem.numOfSuccesses = 0;
            this.testItem.numOfFailures = 0;
            let id = 0;
            r.forEach((row) => {
                row.id = ++id;
                TestDataGeneratorService.ybiTestResultEvaluation(row, () => {
                    this.testItem.numOfSuccesses++;
                    row.testResult = "SUCCESS";
                    return 0;
                }, () => {
                    this.testItem.numOfFailures++;
                    row.testResult = "FAILURE";
                    return 1;
                })
            })
            this.testItem.currentResultData$.next(r)
        });

        this.testItem.ybiTariffResponseSubscription = this.testItem.ybiExistingResponse$.subscribe(r => {
            Suites.rateCalcService.currentPostData = r.post_data;
            Suites.rateCalcService.currentYBIResponse$.next(r);
        });
    }

    stopTests(): void {
        this.testItem.testResultSubscription && this.testItem.testResultSubscription.unsubscribe();
        this.testItem.ybiTariffResponseSubscription && this.testItem.ybiTariffResponseSubscription.unsubscribe();
    }

    static uiRouter: UIRouter;

    constructor(
        public uiRouter: UIRouter,
        public testDataGeneratorService: TestDataGeneratorService, 
        rateCalcService: RateCalcService,
        public testPlanService: TestPlanService) {
        Suites.uiRouter = uiRouter;
        Suites.rateCalcService = rateCalcService;
    }
}