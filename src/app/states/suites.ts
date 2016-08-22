import  {Component, Input, Directive} from '@angular/core';

import {DateData} from '../pojo/date-data';
import {GuestData} from '../pojo/guest-data';

import {TestPlanItem} from '../pojo/test-plan';

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

    constructor() {
    }
}