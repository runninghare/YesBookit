import  {Component, Input, Directive} from '@angular/core';

import {DateData} from '../pojo/date-data';
import {GuestData} from '../pojo/guest-data';
import {RatePostData} from '../pojo/post-data';
import {TestDataGeneratorService} from '../services/test-data-generator.service';
import {YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';

import {TestPlanItem} from '../pojo/test-plan';
import {TestVectors} from '../services/test-vector.service';

import {TestUnit} from '../components/test-unit';

@Component({
    selector: "suite",
    template: `
    <h1>{{testPlan.title}}</h1>
    <!--
    <test-unit [guestData]="guestData" [dateData]="dateData" [itemId]="i"></test-unit>
    -->
    `,
    directives: [TestUnit]
})
export class Suites {

    @Input('testPlan') testPlan: TestPlanItem;

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

    runTest(suiteNo: number): void {
        let baseData = TestDataGeneratorService.generateBaseTestingData(suiteNo);
        let testData: RatePostData[];
        testData = [
            this.testDataGeneratorService.generateTestingData(TestDataGeneratorService.generateBaseTestingData(suiteNo), {
                tariff: {
                    base_nightly: 130
                }
            }),
            this.testDataGeneratorService.generateTestingData(TestDataGeneratorService.generateBaseTestingData(suiteNo), {
                tariff: {
                    base_nightly: 120
                }
            })
        ];
        let testStream = this.testDataGeneratorService.createTestSquence(testData);
        testStream.subscribe((a: YBIExistingTariffResponse) => {
            console.log(a.result[0].total);
        });
        console.log(testData);
    }

    constructor(public testDataGeneratorService: TestDataGeneratorService) {
        // this.runTest(1);
        // let change = {
        let change = {
            user_input: {
                guests: {
                    adults: "*ALL*",
                    children: 0
                }
            },
            tariff: {
                base_nightly: "*ALL*"
            }
        };

        let postArray: RatePostData[] = this.testDataGeneratorService.generateAllTestingDataWithSpec(TestDataGeneratorService.generateBaseTestingData(1),
            change,
            {
                user_input: {
                    guests: {
                        adults: [1, 2, 3],
                    }
                },
                tariff: {
                    base_nightly: [100, 101]
                }
            }
        );

        this.testDataGeneratorService.createTestSquence(postArray).subscribe((d) => console.log(d));

        console.log(postArray);
    }
}