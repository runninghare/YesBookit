export {environment} from './environment';
import  {Component, Input, AfterViewInit} from '@angular/core';
import {UIROUTER_DIRECTIVES} from "ui-router-ng2";
import {FORM_DIRECTIVES} from '@angular/common';
import {DateBarComponent} from './date-bar';
import {DateData} from './pojo/date-data';
import {TestPlanItem} from './pojo/test-plan';
import {TestPlanService} from './services/test-plan.service';

declare var $: JQueryStatic;

@Component({
    selector: "my-app",
    template: `
<div class="ui left vertical sidebar menu green inverted">
	<a class="teal item" uiSref="app.arbitrary" uiSrefActive="active">
		<h3>Arbitrary Unit Tests
		</h3>
		Run unit tests manually or randomly
	</a>
	<a class="teal item" uiSref="app.suites" [uiParams]="{ name: testItem.name} " uiSrefActive="active" *ngFor="let testItem of testPlan; let i = index">
		<h3>{{testItem.title}} <div class="ui teal left pointing label" style="float: right">{{testItem.numOfTests}}</div>
		</h3>
		{{testItem.description}}
	</a>
</div>
<div class="pusher">
	<div class="ui green menu">
		<a href="" (click)="toggleMenu()" class="item">
			<i class="big content icon"></i>
		</a>
		<img  class="logo header item" src="images/YesBookit.png" alt="" width="185" height="60"/>
		<h2 class="header item borderless">Tariff Unit Test Portal</h2>
	</div>
	<div class="ui bottom attached segment" style="background-color: #eceff1">
		<div class="ui container">
			<div class="ui basic segment" style="background-color: #eceff1">
				<ui-view>Test Results</ui-view>
			</div>
		</div>
	</div>
</div>

    `,
    providers: [TestPlanService]
})
export class AppComponent implements AfterViewInit{

    testPlan: TestPlanItem[];

    ngAfterViewInit() {
        $('.sidebar')['sidebar']({context: $('my-app')});
        $('.sidebar')['sidebar']('setting', {dimPage: false, closable: true, transition: 'overlay'});
    }

    toggleMenu(): boolean {
        $('.sidebar')['sidebar']('toggle');
        return false;
    }

    constructor(public testPlanService: TestPlanService) {
        this.testPlan = testPlanService.getTestPlanItems();
    }

}

