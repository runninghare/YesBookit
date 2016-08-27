
import {Component, Input, ViewChild, ElementRef, OnInit} from '@angular/core';

import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';

declare var $: JQueryStatic;

export interface UiTableConfig {
    name: string;
    title: string;
    content?: string;
    sort?: boolean;
    class?: string;
}

export class UITableAction {
	applyRowClasses(row: any): string {
		return null;
	}

	clickRow(row: any): void {
	}
}

export interface UiTableOptions {
	itemsPerPage?: number;
}

interface OrderType {
	name: string;
	order: number;
}

@Component({
    selector: 'ui-table',
    template: `
<table class="ui very compact celled table">
  <thead>
    <tr class="ui content form">
      <th *ngFor="let c of tableConfig" class="field">
      		<a href="" (click)="toggleOrder(c.name)">{{c.title}}</a>
		<div class="ui labeled input">
			<input [name]="c.name" [(ngModel)]="filter[c.name]" (ngModelChange)="filterUpdate($event)" style="width: 50px" placeholder="Search" type="text">
		</div>
      	</th>
    </tr>
  </thead>
  <tbody>
    <tr 	*ngFor="let row of orderedData$ | async" 
          	[class]="tableActions.applyRowClasses(row)" 
          	(click)="tableActions.clickRow(row)"
          >
        <td *ngFor="let k of getKeys(row); let i = index">
        <div [innerHtml]="tableConfig[i].content || row[k]"></div>
        </td>
    </tr>
  </tbody>
  <tfoot>
    <tr><th colspan="3">
      <div class="ui right floated pagination menu">
        <a (click)="currentPage$.next(currentPage-1)" class="icon item">
          <i class="left chevron icon"></i>
        </a>
        <a (click)="currentPage$.next(p)" class="item" *ngFor="let p of [1,2,3,4]">{{p}}</a>
        <a class="icon item">
          <i class="right chevron icon"></i>
        </a>
      </div>
    </th>
  </tr></tfoot>
</table>    
    `,
    inputs: ['tableConfig', 'tableActions', 'dataSource']
})
export class UiTable implements OnInit {

    tableConfig: UiTableConfig[];
    tableActions: any;
    tableOptions: UiTableOptions;

    tableData: Object[];
    dataSource: Observable<Object[]>;

    currentPage: number = 1;
    currentPage$: Subject<number> = new BehaviorSubject<number>(null);

    lastPage: number = 1;
    lastPage$: Subject<number> = new BehaviorSubject<number>(null);

    filter: Object = {};
    filter$: Subject<Object> = new BehaviorSubject<Object>(null);
    filteredData$: Observable<Object[]>;

    orderBy: OrderType[] = [];
    orderBy$: Subject<Object[]> = new BehaviorSubject<Object[]>(null);
    orderedData$: Observable<Object[]>;

    pageNum: number;
    pageNum$: Observable<number>;

    filterUpdate(val): void {
    	console.log(this.filter);
    	this.filter$.next(this.filter);
    }

    toggleOrder(name: string): boolean {
    	var index = this.orderBy.map((elem) => elem.name).indexOf(name);
    	if (index < 0) {
    		this.orderBy.unshift({
    			name: name,
    			order: -1
    		});
    	} else {
    		let oldOrder = this.orderBy.splice(index, 1);
    		oldOrder[0].order = -(oldOrder[0].order);
    		this.orderBy.unshift(oldOrder[0]);
    	}
    	this.orderBy$.next(this.orderBy);
    	return false;
    }

    ngOnInit(): void {
    	
    	this.currentPage$.subscribe((p) => {
    		this.currentPage = Math.max(p, 1);
    		console.log(this.currentPage);
    	});

	this.filteredData$ = this.filter$.combineLatest(this.dataSource, (x: Object, y: Object[]) => {
		if (!x || typeof x != "object") return y;
		return Object.keys(x).reduce((result, key) => result.filter((val) => !x[key] || val[key].toLowerCase().indexOf(x[key].toLowerCase()) > -1), y);
	});

	this.orderedData$ = this.orderBy$.combineLatest(this.filteredData$, (x: Object[], y: Object[]) => {
		if (!x || x.length == 0) return y;
		return y.sort((a, b) => <number>x.reduce((result, elem:any)=>result || ((a[elem.name]<b[elem.name])?elem.order:(a[elem.name]>b[elem.name])?-(elem.order):0), 0));
		// return <Object[]>(x.reduce((pre: any[], elem) => pre.sort((a,b) => (a[elem.name] < b[elem.name])?elem.order:(a[elem.name] > b[elem.name])?-(elem.order):0), y));
	});

	// --- test ---

	this.orderedData$.subscribe((o: Object) => {
		console.log("=== ordered objects ===");
		console.log(o);
	});

	this.orderBy$.subscribe((elem: OrderType[]) => console.log(elem));

	// this.filter$.next({status: "Great", notes: "Mid-Fielder"});
	this.orderBy = [{name:"status", order: -1}, {name: "name", order: -1}];
	this.orderBy$.next(this.orderBy);

    }

    getKeys(obj: Object): any[] {
        return Object.keys(obj);
    }

    constructor() {

    }

}