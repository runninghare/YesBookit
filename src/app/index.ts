export {environment} from './environment';
import  {Component, Input, AfterViewInit} from '@angular/core';
import {UIROUTER_DIRECTIVES} from "ui-router-ng2";
import {FORM_DIRECTIVES} from '@angular/common';
import {DateBarComponent} from './date-bar';
import {DateData} from './pojo/date-data';
import {TestPlanItem} from './pojo/test-plan';

declare var $: JQueryStatic;

@Component({
    selector: "my-app",
    template: `
    <div class="ui green menu">
        <a href="" (click)="toggleMenu()" class="item">
            <i class="big content icon"></i>
        </a>
        <img  class="logo header item" src="images/YesBookit.png" alt="" width="185" height="60"/>
        <h2 class="header item borderless">Tariff Unit Test Portal</h2>
    </div>
    <div class="ui bottom attached segment pushable" style="background-color: #eceff1">
       <div class="ui left vertical sidebar menu green inverted">
           <a class="teal item" uiSref="app.arbitrary" uiSrefActive="active">
              <h3>Arbitrary Unit Tests
              </h3>
            Run unit tests manually or randomly
          </a>
          <a class="teal item" uiSref="app.suites" [uiParams]="{ testPlan: testItem} " uiSrefActive="active" *ngFor="let testItem of testPlan">
              <h3>{{testItem.title}} <div class="ui teal left pointing label" style="float: right">{{testItem.numOfTests}}</div>
              </h3>
            {{testItem.description}}
          </a>
        </div>
         <div class="ui container">
            <div class="ui basic segment" style="background-color: #eceff1">
              <ui-view>Test Results</ui-view>
            </div>
         </div>
    </div>
    `,
    providers: [TestPlanItem]
})
export class AppComponent implements AfterViewInit{

    testPlan: TestPlanItem[];

    ngAfterViewInit() {
        // $('.sidebar')['sidebar']({context: $('.segment.pushable')});
        $('.sidebar')['sidebar']('setting', {dimPage: false, closable: true, transition: 'overlay'});
    }

    toggleMenu(): boolean {
        $('.sidebar')['sidebar']('toggle');
        return false;
    }

    constructor() {
        this.testPlan = [
            new TestPlanItem("Suite 1", "Property Tariff tests without seasonal settings", 5),
            new TestPlanItem("Suite 2", "Property Tariff + Single Season w/o rules & w/o crossover", 4),
            new TestPlanItem("Suite 3", "Property Tariff + Single Season with rules but w/o crossover ", 84),
            new TestPlanItem("Suite 4", "Crossover Tests", 168)
        ];
    }

}

